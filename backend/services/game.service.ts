import { readFileSync } from "fs";
import { ChampionAPI, EvaluateItemStats, ItemAPI } from "./lol.service";
import {
    RelevantProps, Acp, ActivePlayer, AllPropsCS, AllStatsProps, ChampionStats,
    CoreStats, Damage, Damages, DataProps, DefAbilities, DragonProps, EvalItemStats, Event,
    GameEvents, LocalChampion, LocalItems, LocalRunes, Player, Ply,
    ReplacementsProps, Stats, SummonerSpells, TargetChampion, TargetItem,
    ScrapProps
} from "./types-realtime";
import { ToolKeyDependent, ToolKeyless } from "./consts";

const Effects: string = `${process.cwd()}/effects`;

var _Champion: undefined | LocalChampion;
var _Items: undefined | LocalItems;
var _Runes: undefined | LocalRunes;
var _Build: undefined | ScrapProps;
let Recm: undefined | string[];
let ChampionCache: Record<string, TargetChampion> = {};

const AssignChampion = async (g: DataProps): Promise<void> => {
    let k = g.activePlayer.summonerName;
    let x = g.allPlayers;
    let y = x.find(player => player.summonerName === k);
    if (y) {
        g.activePlayer.team = y.team;
        await Promise.all(x.map(async (p, i) => {
            if (ChampionCache[p.championName]) { g.allPlayers[i].champion = ChampionCache[p.championName]; }
            else {
                let c = await ChampionAPI(p.championName) as TargetChampion;
                if (c) {
                    ChampionCache[p.championName] = c;
                    g.allPlayers[i].champion = c;
                }
            }
        }));
    }
};

let j: Record<string, number> = {};

export const Calculate = async (g: DataProps, rec: boolean, t: string, w: boolean = true): Promise<DataProps> => {
    let activePlayer = g.activePlayer;
    let allPlayers = g.allPlayers;
    let events = g.events;
    let map = g.gameData.mapNumber;

    LoadItems();
    LoadRunes();
    LoadBuild();

    let hx;
    let fx;

    if (!rec && w && t) {
        fx = structuredClone(g);
        hx = await Test(fx, rec, t);
    }

    await AssignChampion(g);

    let enmPlayers = allPlayers.filter(p => p.team !== activePlayer.team);

    let all = allPlayers.map(p => ({ name: p.summonerName, team: p.team }));

    for (let player of allPlayers) {
        if (player.summonerName === activePlayer.summonerName) {
            Recm = Recommendation(player.champion.id, player.position) as string[];
            if (w) {
                let l = player.items.map(h => h.itemID.toString());
                Recm = Recm.filter(item => !l.includes(item));
                l.forEach(key => {
                    if (key in j) {
                        delete j[key];
                    }
                });
            }
            if (rec && w) { for (let p of Recm) { j[p] = 0; } }

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
                items: FilterItems(player) || { min: [], max: [] },
                runes: map != 30 ? FilterRunes(activePlayer) || { min: [], max: [] } : { min: [], max: [] },
                spell: { min: FilterSpell(player.summonerSpells), max: [] }
            };
            break;
        }
    }

    let i: number = 0;
    for (let player of enmPlayers) {
        player.dragon = Dragon(events, all, player.team);
        player.baseStats = BaseStats(player.champion.stats, player.level);
        player.championStats = await PlayerStats(player.baseStats, player.items.map(item => item.itemID.toString()));
        player.bonusStats = BonusStats(player.baseStats, player.championStats);

        let stats = AllStats(player, activePlayer);

        let ablt = activePlayer.abilities;
        let relv = activePlayer.relevant;

        player.damage = {
            abilities: Abilities(stats, ablt),
            items: Items(relv.items.min, stats),
            runes: map != 30 ? Runes(relv.runes.min, stats) : {},
            spell: Spell(relv.spell.min, activePlayer.level)
        }
        if (hx) {
            let o = hx.allPlayers.filter(p => p.team !== activePlayer.team)[i].damage;
            let s = Tool(o, player.damage);
            player.tool = {
                dif: s.dif,
                max: o,
                sum: s.sum
            }
        };
        i++;
    }

    if (rec && w && Recm) {
        for (let id of Recm) {
            for (let player of enmPlayers) {
                let a = structuredClone(g);
                let b = await Test(a, rec, id);
                let c = b?.allPlayers.filter(p => p.team !== activePlayer.team)[enmPlayers.indexOf(player)].damage as Damages;
                let d = Tool(c, player.damage);
                j[id] += d.sum;
            }
        }

        t = Object.entries(j).reduce((m, [k, v]) => v > j[m] ? k : m, Object.keys(j)[0]);

        for (let player of enmPlayers) {
            let a = structuredClone(g);
            let b = await Test(a, rec, t);
            let c = b?.allPlayers.filter(p => p.team !== activePlayer.team)[enmPlayers.indexOf(player)].damage as Damages;
            let d = Tool(c, player.damage);
            player.tool = {
                dif: d.dif,
                max: c,
                sum: d.sum,
                rec: j
            }
        }
    }

    if (w) {
        let q = await EvaluateItemStats(t);
        let m = q ? q.stats.raw : undefined;
        let n = q ? q.name : undefined;
        let r = q ? q.gold.total : undefined;

        activePlayer.tool = {
            id: t,
            name: n,
            active: ItemActiveness(t),
            gold: r,
            raw: m
        }
    }

    return g as DataProps;
}

const Tool = (h: Damages, g: Damages): { dif: Damages, sum: number } => {
    const Diff = (x: Damage, y: Damage): Damage => {
        return {
            min: x.min - y.min,
            max: x.max && y.max ? x.max - y.max : x.max ? x.max : y.max,
            type: x.type,
            area: x.area,
            onhit: x.onhit,
            name: x.name
        };
    };

    let sum: number = 0;

    let res: Damages = {
        abilities: {},
        items: {},
        runes: {},
        spell: {}
    };

    const Calc = (u: Record<string, Damage>, v: Record<string, Damage>, d: Record<string, Damage>) => {
        for (let k in u) {
            if (u.hasOwnProperty(k) && v.hasOwnProperty(k)) {
                d[k] = Diff(u[k], v[k]);
                let r = d[k];
                sum += r.min;
                if (r.max) { sum += r.max; };
            }
        }
    };

    Calc(h.abilities, g.abilities, res.abilities);
    Calc(h.items, g.items, res.items);
    Calc(h.runes, g.runes, res.runes);
    Calc(h.spell, g.spell, res.spell);

    return {
        dif: res,
        sum: sum
    }
};

const AssignStats = async (key: string, s: Acp, a: string[]): Promise<void> => {
    let e = await EvaluateItemStats(key) as EvalItemStats;
    if (e) {
        if (ToolKeyless[key]) { ToolKeyless[key](s); }
        for (let [k, v] of Object.entries(e.stats.mod)) {
            let d = k as keyof AllPropsCS;
            if (ToolKeyDependent[key]) {
                let fn = ToolKeyDependent[key];
                if (key == "6694") { fn(d, (25 + 0.11 * (s.championStats.physicalLethality + 15)) / 100, s.championStats); }
                else { fn(d, v, s.championStats); }
            }
            else {
                if (d == "abilityPower") {
                    let y = ["3089", "223089", "8002"];
                    let x = a.filter(i => y.includes(i));
                    let z = 1.35;
                    if (y.includes(key)) { s.championStats[d] = (s.championStats[d] + v) * z; }
                    else if (x.length > 0) { s.championStats[d] += (x.includes("8002") ? 1.5 : z) * v; }
                    else { s.championStats[d] += v; }
                }
                else { s.championStats[d] += v; }
            };
        }
    }
}

const Positions = {
    TOP: "top",
    JUNGLE: "jungle",
    MIDDLE: "mid",
    BOTTOM: "adc",
    SUPPORT: "support"
}

const Recommendation = (x: string, c: string): string[] | void => {
    if (!_Build) { return };
    let w = _Build[x as keyof typeof _Build];
    if (c.length == 0) { c = Object.keys(Positions)[2] }
    let d = Positions[c as keyof typeof Positions];
    let z = w[d as keyof typeof w];
    return z;
}

const Test = async (g: DataProps, rec: boolean, t: string) => {
    let f = { itemID: Number(t) }
    let y = g.allPlayers.find(x => x.summonerName == g.activePlayer.summonerName);
    if (!y) { return; }
    y.items.push(f);
    await AssignStats(t, g.activePlayer, y.items.map(i => i.itemID.toString()));
    let k = await Calculate(g, rec, t, false);
    return k;
}

const FilterSpell = (spell: SummonerSpells): string[] => {
    const valid = ["SummonerDot"];
    const m = (x: string) => x.match(/SummonerSpell_(\w+)_Description/);

    return [spell.summonerSpellOne.rawDescription, spell.summonerSpellTwo.rawDescription]
        .map(m)
        .filter(match => match && valid.includes(match[1]))
        .map(match => match![1]);
};

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
    s.forEach(d => { if (cases.hasOwnProperty(d)) { j[d] = cases[d](); } });
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
            let total = item.effect?.[stats.activePlayer.level - 1];
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
    let n = x.bonusStats;
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

    rel.runes.min.includes("8299") ? acpMod += mshp > 0.7 ? 0.11 : mshp >= 0.4 ? 0.2 * mshp - 0.03 : 0 : 0;
    rel.items.min.includes("4015") ? acpMod += exhp / (220000 / 15) : 0;

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
                abilityPower: acs.abilityPower,
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

const LoadBuild = (): void => {
    if (_Build) { return }
    else {
        _Build = JSON.parse(readFileSync(`${process.cwd()}/cache/builds.json`, "utf-8")) as ScrapProps;
    }
}

const FilterRunes = (activePlayer: ActivePlayer): RelevantProps | void => {
    if (!_Runes) { return };
    let runes = activePlayer.fullRunes.generalRunes.map(rune => rune.id.toString());
    let min: string[] = [];
    let max: string[] = [];
    let y = _Runes.data;
    let x = Object.keys(y);
    runes.forEach(rune => {
        if (_Runes && x.includes(rune)) {
            min.push(rune);
            if (y[rune].max) { max.push(rune); }
        }
    })
    return {
        min: Order(min),
        max: Order(max)
    }
}

const Order = (x: string[]): string[] => x.sort((a, b) => parseInt(a) - parseInt(b));

const ItemActiveness = (i: string): boolean => {
    if (!_Items) { return false }
    let y = Object.keys(_Items.data);
    return y.includes(i);
}

const FilterItems = (player: Player): RelevantProps | void => {
    if (!_Items) { return }
    let items = player.items.map(item => item.itemID.toString())
    let min: string[] = [];
    let max: string[] = [];
    let y = _Items.data
    let x = Object.keys(y);
    items.forEach(item => {
        if (_Items && x.includes(item)) {
            min.push(item);
            if (y[item].max) { max.push(item); }
        }
    })
    return {
        min: Order(min),
        max: Order(max)
    }
}

const LoadItems = (): void => {
    if (_Items) { return }
    else {
        _Items = JSON.parse(readFileSync(`${Effects}/items.json`, "utf-8")) as LocalItems;
    }
}

const LoadChampion = (id: string): void => {
    if (_Champion && _Champion[id]) { return }
    else {
        _Champion = JSON.parse(readFileSync(`${process.cwd()}/champions/${id}.json`, "utf-8")) as LocalChampion;
    }
}

const FilterAbilities = (id: string): RelevantProps | void => {
    let x = _Champion?.[id];
    let j: string[] = [];
    if (x) {
        for (let [k, v] of Object.entries(x)) { if (v.max?.length) { j.push(k) } };
        let t = Object.keys(x);
        return {
            min: t.concat(["A", "C"]),
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