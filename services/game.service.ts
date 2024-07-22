import { readFileSync } from "fs";
import { ChampionAPI, ItemAPI } from "./lol.service";
import {
    AbilityFilter, Acp, ActivePlayer, AllPropsCS, AllStatsProps, ChampionStats,
    CoreStats, Damage, DataProps, DefAbilities, DragonProps, EvalItemStats, Event,
    GameEvents, Info, KeyReplaces, LocalChampion, LocalItems, LocalRunes, Player, Ply,
    ReplacementsProps, Stats, SummonerSpells, TargetChampion, TargetItem,
    ToolProps
} from "./interfaces";
import { ToolKeyDependent, ToolKeyless } from "./consts";

const Effects: string = `${process.cwd()}/effects`;

var _Champion: undefined | LocalChampion;
var _Items: undefined | LocalItems;
var _Runes: undefined | LocalRunes;
var _Replaces: undefined | KeyReplaces;

const AssignChampion = async (g: DataProps): Promise<void> => {
    let k = g.activePlayer.summonerName
    let x = g.allPlayers;
    let y = x.find(player => player.summonerName === k);
    if (y) {
        g.activePlayer.team = y.team;
        await Promise.all(x.map(async (p, i) => {
            if (p.team !== y.team || p.summonerName === k) {
                let c = await ChampionAPI(p.championName) as TargetChampion;
                if (c) { g.allPlayers[i].champion = c; }
            }
        }));
    }
};

const Calculate = async (): Promise<DataProps> => {
    var g = JSON.parse(readFileSync(`${process.cwd()}/services/exampledefault.json`, "utf-8")) as DataProps;

    let activePlayer = g.activePlayer;
    let allPlayers = g.allPlayers;
    let events = g.events;
    let map = g.gameData.mapNumber;

    await AssignChampion(g);
    LoadItems();
    LoadRunes();
    LoadReplaces();

    let all = allPlayers.map(p => ({ name: p.summonerName, team: p.team }));

    for (let player of allPlayers) {
        if (player.summonerName === activePlayer.summonerName) {
            activePlayer.champion = player.champion;

            let id = activePlayer.champion.id;

            activePlayer.championName = player.championName;
            activePlayer.skin = player.skinID;

            LoadChampion(id);

            let base = BaseStats(player.champion.stats, player.level);
            activePlayer.baseStats = base;
            activePlayer.bonusStats = BonusStats(base, activePlayer.championStats);

            activePlayer.items = player.items.map(item => item.itemID.toString());
            activePlayer.relevant = {
                abilities: FilterAbilities(id) || { min: [], max: [] },
                items: FilterItems(player),
                runes: map != 30 ? FilterRunes(activePlayer) : [],
                spell: FilterSpell(player.summonerSpells)
            };
            break;
        }
    }
    for (let player of allPlayers) {
        if (player.team !== activePlayer.team) {
            player.dragon = Dragon(events, all, player.team);
            player.baseStats = BaseStats(player.champion.stats, player.level);
            player.championStats = await PlayerStats(player.baseStats, player.items.map(item => item.itemID.toString()));
            player.bonusStats = BonusStats(player.baseStats, player.championStats);

            let stats = AllStats(player, activePlayer);

            let ablt = activePlayer.abilities;
            let relv = activePlayer.relevant;

            player.damage = {
                abilities: Abilities(stats, ablt),
                items: Items(relv.items, stats),
                runes: map != 30 ? Runes(relv.runes, stats) : {},
                spell: Spell(relv.spell, activePlayer.level),
                tool: {
                    A: await Tool(activePlayer, player, stats, "3115"),
                    B: await Tool(activePlayer, player, stats, "4645")
                }
            }
        }
        break;
    }
    return g as DataProps;
}

const Spell = (s: string[], lvl: number): Record<string, Damage> => {
    let j: Record<string, Damage> = {};
    const cases: Record<string, () => Damage> = {
        SummonerDot: () => {
            return {
                name: "Ignite",
                type: "true",
                min: 50 + 20 * lvl
            }
        }
    }
    s.forEach(d => {
        let match = d.match(/SummonerSpell_(\w+)_Description/);
        if (match) {
            let t = match[1];
            if (cases.hasOwnProperty(t)) { j[t] = cases[t](); }
        }
    });
    return j;
}

const Items = (items: string[], stats: AllStatsProps): Record<string, Damage> => {
    let j: Record<string, Damage> = {};

    let f = stats.activePlayer.form;

    for (let k of items) {
        let item = _Items?.data[k];
        if (item) {
            let min = item.min[f];
            let max = item.max?.[f];
            let total = item.effect?.[stats.activePlayer.level];
            let [n, m] = Evaluate(min, max, stats, total ? { total } : undefined);
            j[k] = {
                min: n,
                max: m,
                type: item.type,
                name: item.name,
                onhit: item.onhit
            };
        }
    }
    return j;
}

const Runes = (runes: string[], stats: AllStatsProps): Record<string, Damage> => {
    if (!runes.length || !_Runes) { return {}; }

    let j: Record<string, Damage> = {};

    for (let k of runes) {
        let rune = _Runes.data[k];
        if (rune) {
            let min = rune.min[stats.activePlayer.form];
            let [n] = Evaluate(min, null, stats);
            j[k] = {
                min: n,
                type: rune.type == "adaptative" ? stats.activePlayer.adaptative.type : rune.type,
                name: rune.name
            };
        }
    }
    return j;
}

const Evaluate = (x: string | null | undefined, y: string | null | undefined, z: AllStatsProps, w?: Record<string, number>): [number, number | null] => {
    let r = Replacements(z);
    let t = w ? { ...r, ...w } : r;

    for (const [k, v] of Object.entries(t)) {
        if (x) { x = x.replace(new RegExp(k, 'g'), String(v)); };
        if (y) { y = y.replace(new RegExp(k, 'g'), String(v)); };
    }

    let n = x ? eval(x) : null;
    let m = y ? eval(y) : null;

    return [n, m];
}

const Abilities = (stats: AllStatsProps, b: DefAbilities): Record<string, Damage> => {
    let res: Record<string, Damage> = {}

    if (!_Champion) { return res; }

    let p = stats.activePlayer;
    let x = _Champion[p.id];

    let aa = p.championStats.attackDamage * p.multiplier.physical;

    const atk: Record<string, () => [number, null]> = {
        A: () => [aa, null],
        C: () => [aa * p.championStats.critDamage / 100, null]
    }

    let gn = p.multiplier.general;
    let pm = stats.player.multiplier;

    let d = Object.keys(x);

    const typ: Record<string, (n: number, m: number | null) => void> = {
        physical: (n, m) => {
            let t = gn * pm.physical
            n *= t;
            m ? m *= t : null;
        },
        magic: (n, m) => {
            let t = gn * pm.magic
            n *= t;
            m ? m *= t : null;
        },
        true: (n, m) => {
            n *= gn;
            m ? m *= gn : null;
        }
    }

    for (let i of d) {
        let r = i.charAt(0) as keyof typeof b;
        let y = x?.[i];
        let l: number = r == "Passive" ? stats.activePlayer.level : b[r].abilityLevel || 0;

        let ty = y?.type;
        let ar = y?.area;

        if (y && l > 0) {
            let min = y.min?.[l - 1];
            let max = y.max?.[l - 1];

            let [n, m] = Evaluate(min, max, stats);

            if (ty) { typ[ty](n, m) }

            res[i] = {
                min: n,
                max: m,
                type: ty,
                area: ar
            } as Damage;
        }
        else if (l == 0) {
            res[i] = {
                min: 0,
                max: 0,
                type: ty,
                area: ar
            }
        }
    }

    for (let t of ["A", "C"]) {
        if (!res[t]) {
            let [n, m] = atk[t]();
            typ.physical(n, m);
            res[t] = {
                min: n,
                type: "physical",
                area: false
            }
        }
    }

    return res;
};

const Replacements = (stats: AllStatsProps): ReplacementsProps => {
    let x = stats.activePlayer;
    let y = stats.player;
    let z = stats.property;
    let k = x.championStats;
    let j = x.baseStats;
    let n = x.bonusStats
    let m = y.championStats;
    return {
        steelcapsEffect: z.steelcaps,
        attackReductionEffect: z.rocksolid,
        exceededHP: z.excessHealth,
        missingHP: z.missingHealth,
        magicMod: x.multiplier.magic,
        physicalMod: x.multiplier.physical,
        level: x.level,
        currentAP: k.abilityPower,
        currentAD: k.attackDamage,
        currentLethality: k.physicalLethality,
        maxHP: k.maxHealth,
        maxMana: k.resourceMax || 0,
        currentMR: k.magicResist,
        currentArmor: k.armor,
        currentHealth: k.currentHealth,
        basicAttack: 1,
        attackSpeed: k.attackSpeed,
        critChance: k.critChance,
        critDamage: k.critDamage,
        adaptative: x.adaptative.ratio,
        baseHP: j.maxHealth,
        baseMana: j.resourceMax || 0,
        baseArmor: j.armor,
        baseMR: j.magicResist,
        baseAD: j.attackDamage,
        bonusAD: n.attackDamage,
        bonusHP: n.maxHealth,
        bonusArmor: n.armor,
        bonusMR: n.magicResist,
        expectedHealth: m.maxHealth,
        expectedMana: m.resourceMax || 0,
        expectedArmor: m.armor,
        expectedMR: m.magicResist,
        expectedAD: m.attackDamage,
        expectedBonusHealth: y.bonusStats.maxHealth
    }
}

const AllStats = (player: Ply, activePlayer: Acp): AllStatsProps => {
    let acs = activePlayer.championStats;
    let abs = activePlayer.bonusStats;
    let abt = activePlayer.baseStats;

    let pcs = player.championStats;
    let pbs = player.bonusStats;
    let pbt = player.baseStats;

    let [acpMod, pphyMod, pmagMod, pgenMod] = [1, 1, 1, 1];

    const chspec: Record<string, () => void> = {
        Kassadin: () => {
            pmagMod -= 0.1;
        },
        Ornn: () => {
            const mlt = (x: any): void => {
                let n = 1.1;
                if (player.level > 13) { n += (player.level - 13) * 0.04 };
                x.armor *= n;
                x.magicResist *= n;
                x.maxHealth *= n;
            }
            mlt(pcs); mlt(pbs); mlt(pbt);
        },
        Malphite: () => {
            const amt = (x: any): void => {
                let n = (player.level > 14) ? 1.3 : 1.15;
                x.armor *= n;
            }
            amt(pcs); amt(pbs); amt(pbt);
        }
    }

    if (chspec[player.champion.id]) { chspec[player.champion.id]() }

    let rar = Math.max(0, pcs.armor * acs.armorPenetrationPercent - acs.physicalLethality);
    let rmr = Math.max(0, pcs.magicResist * acs.magicPenetrationPercent - acs.magicPenetrationFlat);

    let physical = 100 / (100 + rar);
    let magic = 100 / (100 + rmr);

    let adp = 0.35 * abs.attackDamage >= 0.2 * acs.abilityPower;
    let add = adp ? physical : magic;

    let sft: Record<string, { long: string; short: string; }> = {
        Gnar: { long: "Gnar", short: "MegaGnar" },
        Elise: { long: "Elise", short: "EliseMelee" },
        Jayce: { long: "JayceRanged", short: "Jayce" },
        Nidalee: { long: "Nidalee", short: "NidaleeMelee" }
    };

    let championName = activePlayer.championName as keyof typeof sft;
    let chd = sft[championName]?.[acs.attackRange > 350 ? "long" : "short"];
    if (chd) { activePlayer.champion.id = chd; }

    let ohp = pcs.maxHealth / acs.maxHealth;
    let ehp = pcs.maxHealth - acs.maxHealth;
    let mshp = 1 - acs.currentHealth / acs.maxHealth;
    let exhp = ehp > 2500 ? 2500 : ehp < 0 ? 0 : ehp;

    let rel = activePlayer.relevant;

    rel.runes.includes("8299") ? acpMod += mshp > 0.7 ? 0.11 : mshp >= 0.4 ? 0.2 * mshp - 0.03 : 0 : 0;
    rel.items.includes("4015") ? acpMod += exhp / (220000 / 15) : 0;

    return {
        activePlayer: {
            id: activePlayer.champion.id,
            level: activePlayer.level,
            form: acs.attackRange > 350 ? "ranged" : "melee",
            multiplier: {
                magic: magic,
                physical: physical,
                general: acpMod
            },
            adaptative: {
                type: adp ? "physical" : "magic",
                ratio: add
            },
            championStats: {
                abilityPower: acs.abilityHaste,
                attackDamage: acs.attackDamage,
                magicResist: acs.magicResist,
                armor: acs.armor,
                resourceMax: acs.resourceMax,
                maxHealth: acs.maxHealth,
                currentHealth: acs.currentHealth,
                attackSpeed: acs.attackSpeed,
                attackRange: acs.attackRange,
                critChance: acs.critChance,
                critDamage: acs.critDamage,
                physicalLethality: acs.physicalLethality,
                armorPenetrationPercent: acs.armorPenetrationPercent,
                magicPenetrationPercent: acs.magicPenetrationPercent,
                magicPenetrationFlat: acs.magicPenetrationFlat
            },
            baseStats: {
                maxHealth: abt.maxHealth,
                resourceMax: abt.resourceMax,
                armor: abt.armor,
                magicResist: abt.magicResist,
                attackDamage: abt.attackDamage,
                abilityPower: abt.abilityPower
            },
            bonusStats: {
                maxHealth: abs.maxHealth,
                resourceMax: abs.resourceMax,
                armor: abs.armor,
                magicResist: abs.magicResist,
                attackDamage: abs.attackDamage,
                abilityPower: abs.abilityPower
            }
        },
        player: {
            multiplier: {
                physical: pphyMod,
                magic: pmagMod,
                general: pgenMod
            },
            realStats: {
                magicResist: rmr,
                armor: rar
            },
            baseStats: {
                maxHealth: pbt.maxHealth,
                resourceMax: pbt.resourceMax,
                armor: pbt.armor,
                magicResist: pbt.magicResist,
                attackDamage: pbt.attackDamage,
                abilityPower: pbt.abilityPower
            },
            bonusStats: {
                maxHealth: pbs.maxHealth,
                resourceMax: pbs.resourceMax,
                armor: pbs.armor,
                magicResist: pbs.magicResist,
                attackDamage: pbs.attackDamage,
                abilityPower: pbs.abilityPower
            },
            championStats: {
                maxHealth: pcs.maxHealth,
                attackDamage: pcs.attackDamage,
                magicResist: pcs.magicResist,
                armor: pcs.armor,
                resourceMax: pcs.resourceMax,
                abilityPower: pcs.abilityPower
            }
        },
        property: {
            overHealth: ohp < 1.1 ? 0.65 : ohp > 2 ? 2 : ohp,
            excessHealth: exhp,
            missingHealth: mshp,
            steelcaps: player.items.find(item => item.itemID.toString() == "3047") ? 0.88 : 1,
            rocksolid: player.items.filter(item => ["3143", "3110", "3082"].includes(item.itemID.toString())).reduce((t) => t + (pcs.maxHealth / 1000 * 3.5), 0),
            randuin: player.items.find(item => item.itemID.toString() == "3143") ? 0.7 : 1
        }
    }
}

const PlayerStats = async (a: CoreStats, b: string[]): Promise<CoreStats> => {
    let [maxHealth, magicResist, armor, resourceMax, abilityPower, attackDamage] = [0, 0, 0, 0, 0, 0];
    for (let i of b) {
        let x = await ItemAPI(i) as TargetItem;
        let { FlatHPPoolMod, FlatMagicDamageMod, FlatArmorMod, FlatSpellBlockMod, FlatMPPoolMod, FlatPhysicalDamageMod } = x.stats;
        maxHealth += FlatHPPoolMod || 0;
        armor += FlatArmorMod || 0;
        magicResist += FlatSpellBlockMod || 0;
        resourceMax += FlatMPPoolMod || 0;
        attackDamage += FlatPhysicalDamageMod || 0;
        abilityPower += FlatMagicDamageMod || 0
    }
    return {
        maxHealth: a.maxHealth + maxHealth,
        magicResist: a.magicResist + magicResist,
        attackDamage: a.attackDamage + attackDamage,
        resourceMax: a.resourceMax ? a.resourceMax + resourceMax : 0,
        abilityPower: a.abilityPower + abilityPower,
        armor: a.armor + armor
    }
}

const LoadRunes = (): void => {
    if (_Runes) { return }
    else {
        _Runes = JSON.parse(readFileSync(`${Effects}/runes.json`, "utf-8")) as LocalRunes;
    }
}

const FilterSpell = (spell: SummonerSpells): string[] => {
    let [one, two] = [spell.summonerSpellOne.rawDescription, spell.summonerSpellTwo.rawDescription];
    let k = new Array<string>(one, two);
    return k
};

const FilterRunes = (activePlayer: ActivePlayer): Array<string> => {
    let runes = activePlayer.fullRunes.generalRunes.map(rune => rune.id.toString());
    let array: string[] = [];
    runes.forEach(rune => {
        if (_Runes && Object.keys(_Runes.data).includes(rune)) { array.push(rune) }
    })
    return array
}

const FilterItems = (player: Player): Array<string> => {
    let items = player.items.map(item => item.itemID.toString())
    let array: string[] = [];
    items.forEach(item => {
        if (_Items && Object.keys(_Items.data).includes(item)) { array.push(item) }
    })
    return array
}

const LoadItems = (): void => {
    if (_Items) { return }
    else {
        _Items = JSON.parse(readFileSync(`${Effects}/items.json`, "utf-8")) as LocalItems;
    }
}

const LoadReplaces = (): void => {
    if (_Replaces) { return }
    else {
        _Replaces = JSON.parse(readFileSync(`${Effects}/replacements.json`, "utf-8")) as KeyReplaces;
    }
}

const LoadChampion = (id: string): void => {
    if (_Champion && _Champion[id]) { console.log(_Champion); return }
    else {
        _Champion = JSON.parse(readFileSync(`${process.cwd()}/champions/${id}.json`, "utf-8")) as LocalChampion;
    }
}

const FilterAbilities = (id: string): AbilityFilter | void => {
    let x = _Champion?.[id];
    let j: string[] = []
    if (x) {
        for (let [k, v] of Object.entries(x)) {
            if (v.max?.length) { j.push(k) }
        };
        return {
            min: Object.keys(x),
            max: j
        };
    }
}

const Dragon = (event: GameEvents, all: { name: string, team: string }[], team: string): DragonProps => {
    let [earth, chemtech, fire] = [1, 1, 1];
    let x: Event[] = event.Events

    let fn: Record<string, () => void> = {
        Earth: () => earth += 0.05,
        Chemtech: () => chemtech += 0.06,
        Fire: () => fire += 0.03
    };

    x.forEach((e) => {
        if (e.DragonType && fn[e.DragonType]) {
            let x = e.KillerName
            let y = all.find(a => a.name === x)
            if (y) {
                let z = y.team
                if (z === team) {
                    fn[e.DragonType]();
                }
            }
        }
    })

    return {
        earth: earth,
        fire: fire,
        chemtech: chemtech
    }
}

const StatFormula = (a: number, b: number, c: number) => a + b * (c - 1) * (0.7025 + 0.0175 * (c - 1));

const BaseStats = (b: Stats, c: number): CoreStats => {
    return {
        maxHealth: StatFormula(b.hp, b.hpperlevel, c),
        armor: StatFormula(b.armor, b.armorperlevel, c),
        magicResist: StatFormula(b.spellblock, b.spellblockperlevel, c),
        attackDamage: StatFormula(b.attackdamage, b.attackdamageperlevel, c),
        resourceMax: b.mp == 0 ? 0 : StatFormula(b.mp, b.mpperlevel, c),
        abilityPower: 0
    }
}

const BonusStats = (b: CoreStats, c: ChampionStats | CoreStats): CoreStats => {
    return {
        maxHealth: c.maxHealth - b.maxHealth,
        armor: c.armor - b.armor,
        magicResist: c.magicResist - b.magicResist,
        attackDamage: c.attackDamage - b.attackDamage,
        resourceMax: c.resourceMax && b.resourceMax ? c.resourceMax - b.resourceMax : 0,
        abilityPower: c.abilityPower
    };
};

const EvaluateItemStats = async (item: string): Promise<EvalItemStats | void> => {
    if (!_Replaces) { return };
    let k = _Replaces.percentages;
    let r = _Replaces.keys;
    let e = _Replaces.extras;
    let u = ["attention", "buffedStat", "nerfedStat", "ornnBonus"];
    let x = await ItemAPI(item) as TargetItem;
    let y = x.description;

    let res: any = {};

    let a: RegExp = /<(attention|buffedStat|nerfedStat|ornnBonus)>(.*?)<\/(attention|buffedStat|nerfedStat|ornnBonus)>/g
    let b: RegExp = /(.*?)<br>/g;
    let c: RegExp = /^\s*\d+\s*%?\s*/;
    let d: RegExp = /<\/?[^>]+(>|$)/g;

    let m: RegExpExecArray | null;
    let n: any;

    while ((m = a.exec(y))) {
        let t = m[1];
        let v = m[2].replace("%", "");
        if (!n) {
            let nm = b.exec(m.input);
            if (nm) { n = nm[1].replace(d, "").trim(); };
        }
        if (u.includes(t)) {
            let j = n?.replace(c, "");
            if (j?.length) {
                if (k.some(k => n.includes(k)) && m[2].includes("%")) {
                    let h = parseFloat(v) / 100;
                    res[j] = j.includes("Penetration") ? -h : h;
                }
                else { res[j] = parseFloat(v) };
            }
        }
        n = undefined;
    }

    for (let [f, g] of Object.entries(res)) {
        if (r[f]) { res[r[f]] = g };
        delete res[f];
    }

    if (e[item]) {
        for (let [p, q] of Object.entries(e[item])) {
            res[p] = res[p] ? res[p] += q : q;
        }
    }

    return {
        name: x.name,
        stats: res,
        stack: x.gold.total <= 1450,
        from: x.from,
        gold: x.gold
    } as EvalItemStats;
}

const Tool = async (a: Acp, p: Ply, stats: AllStatsProps, key: string): Promise<ToolProps> => {
    let b = a.relevant;
    let c = a.abilities;
    let t = await EvaluateItemStats(key) as EvalItemStats;
    let i: Info = {
        id: key,
        name: t.name,
        gold: t.gold.total,
        value: 0
    }

    if (a.items.includes(key) && !t.stack) { return { info: i }; };

    let prev = {
        abilities: Abilities(stats, c),
        items: Items(b.items, stats),
        runes: Runes(b.runes, stats)
    };

    let s = structuredClone(a);

    if (t) {
        if (ToolKeyless[key]) { ToolKeyless[key](s); }
        for (let [k, v] of Object.entries(t.stats)) {
            let d = k as keyof AllPropsCS;
            if (ToolKeyDependent[key]) { ToolKeyDependent[key](d, v, s.championStats[d]) }
            // Later include correct calculation from when that's already a value for penetration %
            else { s.championStats[d] += v; };
        }
    }

    let r = AllStats(p, s);

    let next = {
        abilities: Abilities(r, c),
        items: Items(b.items.concat(key), r),
        runes: Runes(b.runes, r)
    }

    const Delta = (n: Damage, p: Damage): Damage => ({
        min: n.min - p.min,
        max: n.max && p.max ? n.max - p.max : n.max,
        type: n.type,
        name: n.name,
        area: n.area,
        onhit: n.onhit
    });

    const Diff = (n: Record<string, Damage>, p: Record<string, Damage>): Record<string, Damage> => {
        let r: Record<string, Damage> = {};
        for (let k in n) {
            if (p[k]) { r[k] = Delta(n[k], p[k]); }
            else { r[k] = n[k]; }
        }
        return r;
    }

    let increase = {
        abilities: Diff(next.abilities, prev.abilities),
        items: Diff(next.items, prev.items),
        runes: Diff(next.runes, prev.runes)
    }

    return {
        info: i,
        provide: increase,
        result: next
    } as ToolProps;
}

(async () => {
    const data = await Calculate();
    // console.log(data.allPlayers[0].damage.tool.A);
})();