import { readFileSync } from "fs";
import { ChampionAPI, ItemAPI } from "./lol.service";
import {
    AbilityFilter, ActivePlayer, AllStatsProps, ChampionStats,
    CoreStats, Damage, DataProps, DragonProps, Event, ExtendsPlayer,
    GameEvents, LocalChampion, LocalItems, LocalRunes, Player,
    ReplacementsProps, Stats, SummonerSpells, TargetChampion, TargetItem
} from "./interfaces";

var _Champion: undefined | LocalChampion;
var _Items: undefined | LocalItems;
var _Runes: undefined | LocalRunes;

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
    let gameData = g.gameData;

    await AssignChampion(g);
    LoadItems();
    LoadRunes();

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
                runes: FilterRunes(activePlayer),
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

            player.damage = {
                abilities: {
                    P: Abilities("P", stats, activePlayer.level),
                    Q: Abilities("Q", stats, ablt.Q.abilityLevel),
                    W: Abilities("W", stats, ablt.Q.abilityLevel),
                    E: Abilities("E", stats, ablt.E.abilityLevel),
                    R: Abilities("R", stats, ablt.R.abilityLevel),
                    A: Abilities("A", stats),
                    C: Abilities("C", stats)
                },
                items: Items(activePlayer.relevant.items, stats),
                runes: Runes(activePlayer.relevant.runes, stats),
                spell: Spell(activePlayer.relevant.spell, activePlayer.level)
            }
        }
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
    s.forEach(spell => { if (cases.hasOwnProperty(spell)) { j[spell] = cases[spell](); } });
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

const Abilities = (a: "P" | "Q" | "W" | "E" | "R" | "A" | "C", stats: AllStatsProps, b: number = 1): Damage => {
    const fail: Damage = { min: 0, max: 0, type: "unknown", area: false }

    if (!_Champion || b == 0) { return fail; }

    let p = stats.activePlayer;
    let x = _Champion[p.id];

    let y = x[a];

    if (!y) { return fail };

    let min = y.min?.[b ? b - 1 : 0];
    let max = y.max ? y.max[b ? b - 1 : 0] : null;

    const atk: Record<string, () => [number, null]> = {
        A: () => [p.championStats.attackDamage * p.multiplier.physical, null],
        C: () => [p.championStats.attackDamage * p.multiplier.physical * p.championStats.critDamage, null]
    }

    let ty = y?.type;
    let ar = y?.area;

    let [n, m] = !min && ["A", "C"].includes(a) ? atk[a]() : Evaluate(min, max, stats);

    let gn = stats.activePlayer.multiplier.general;
    let pm = stats.player.multiplier;

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

    if (ty) { typ[ty](n, m) }

    return {
        min: n,
        max: m,
        type: ty,
        area: ar
    } as Damage;
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
        currentLethality: k.armorPenetrationFlat,
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

const AllStats = (player: Player & ExtendsPlayer, activePlayer: DataProps["activePlayer"]): AllStatsProps => {
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

    let rar = Math.max(0, pcs.armor * acs.armorPenetrationPercent - acs.armorPenetrationFlat);
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
                armorPenetrationFlat: acs.armorPenetrationFlat,
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
        _Runes = JSON.parse(readFileSync(`${process.cwd()}/effects/runes.json`, "utf-8")) as LocalRunes;
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
        _Items = JSON.parse(readFileSync(`${process.cwd()}/effects/items.json`, "utf-8")) as LocalItems
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

const StatFormula = (a: number, b: number, c: number) => {
    return Math.round(a + b * (c - 1) * (0.7025 + 0.0175 * (c - 1)));
}

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

(async () => {
    const data = await Calculate();
    console.log(data);
})();