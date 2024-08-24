import { readFileSync } from "fs";
import { CalculatorProps } from "./types-calculator";
import { AllPropsCS, AllStatsProps, Damage, Damages, DefAbilities, EvalItemStats, LocalChampion, LocalItems, LocalRunes, RelevantProps, ScrapProps, TargetChampion } from "./types-realtime";
import { ChampionAPI, EvaluateItemStats } from "./lol.service";
import { BaseStats, BonusStats, Evaluate, Order, PlayerStats, Spell, Tool } from "./game.service";
import { ToolKeyDependent, ToolKeyless } from "./consts";

const Effects: string = `${process.cwd()}/effects`;

var _Champion: undefined | LocalChampion;
var _Items: undefined | LocalItems;
var _Runes: undefined | LocalRunes;
var _Build: undefined | ScrapProps;
let Recm: undefined | string[];
let ChampionCache: Record<string, TargetChampion> = {};

const AssignChampion = async (g: CalculatorProps): Promise<void> => {
    let x = g.allPlayers;
    let e = g.activePlayer.championId;
    if (ChampionCache[e]) { g.activePlayer.champion = ChampionCache[e]; }
    else {
        let c = await ChampionAPI(e);
        if (c) {
            ChampionCache[e] = c;
            g.activePlayer.champion = c;
        }
    }
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

const AssignItemStats = async (g: CalculatorProps): Promise<number> => {
    let _as = 0;
    let w = g.activePlayer;
    let m = w.championStats;
    let x = w.items;
    let _m = ["3089", "223089", "8002"];
    x = x.filter(s => !_m.includes(s)).concat(x.filter(u => _m.includes(u)));
    let t = false;
    for (let y of x) {
        _as += await AssignStats(y, g.activePlayer, []) as number;
        /*
        let z = await EvaluateItemStats(y) as EvalItemStats;
        let b = z.stats.mod;
        let c = Object.keys(b) as Array<keyof typeof b>;;
        for (let d of c) {
            if (d == "attackSpeed") { _as += parseFloat(b[d]) }
            if (!d.includes("Percent") && typeof m[d] === "number") {
                m[d] += (typeof b[d] === "number" ? b[d] : 0);
            }
            else { t = true }
        }
        */
    }
    if (m.critChance > 100) { m.critChance = 100 };
    let e = w.baseStats;
    let f = Object.keys(e);
    for (let h of f) {
        m[h as keyof typeof m] += e[h as keyof typeof e] || 0;
    }
    let k: Record<string, number> = {
        Ashe: 100,
        Yasuo: 157.5,
        Yone: 157.5,
        Jhin: 150.5
    }
    let l = w.champion.id;
    m.critDamage += Object.keys(k).includes(l) ? k[l] : 175;
    let n: Record<string, (o: typeof w.abilities, q?: string) => void> = {
        Darius: (o, q) => {
            let v = o.E.abilityLevel;
            if (v > 0) {
                if (q) { q += `(1 - ${(15 + 5 * v) / 100})` }
                else { m.armorPenetrationPercent += 15 + 5 * v; }
            }
        },
        Pantheon: (o, q) => {
            let v = o.R.abilityLevel;
            if (v > 0) {
                if (q) { q += `(1 - ${(10 * v) / 100})` }
                else { m.armorPenetrationPercent += 10 * v; }
            }
        },
        Nilah: (o, q) => {
            let v = o.Q.abilityLevel;
            if (v > 0) {
                if (q) { q += `(1 - ${(m.critChance / 3) / 100})` }
                else { m.armorPenetrationPercent += m.critChance / 3; }
            }
        },
        Mordekaiser: (o, q) => {
            let v = o.E.abilityLevel;
            if (v > 0) {
                if (q) { q += `(1 - ${(2.5 + 2.5 * v) / 100})` }
                else { m.magicPenetrationPercent += 2.5 + 2.5 * v; }
            }
        }
    }

    const _R = (i: string, k: string, t: keyof typeof m): void => {
        let _d = parseFloat(i.replace("%", ""));
        k += `(1 - ${_d / 100})`;
        let _e = eval(k.replace(/\)\(/g, ') * ('));
        m[t] = 100 * (1 - _e);
    }

    let p = [3033, 3035, 3036, 3071, 3135, 3137, 3302, 4010, 4015, 4630, 6694, 7037, 223033, 223036, 223071, 228005, 443135];
    let r = p.filter(q => x.includes(q.toString()));
    let _c = Object.keys(n) as Array<keyof typeof n>;
    if (t) {
        let s: string = '';
        let u: string = '';
        for (let v of r) {
            let _a = await EvaluateItemStats(v.toString()) as EvalItemStats;
            let _b = _a.stats.mod;
            let _ar = _b.armorPenetrationPercent;
            let _mr = _b.magicPenetrationPercent;
            if (_ar) {
                if (_c.includes(l)) { n[l](w.abilities, s); }
                _R(_ar, s, "armorPenetrationPercent");
            }
            if (_mr) {
                if (_c.includes(l)) { n[l](w.abilities, u); }
                _R(_mr, u, "magicPenetrationPercent");
            }
        }
    }
    else { if (_c.includes(l)) { n[l](w.abilities); } }
    return _as;
}

let j: Record<string, number> = {};

export const Calculator = async (g: CalculatorProps, rec: boolean, t: string, w: boolean = true): Promise<CalculatorProps | undefined> => {
    let activePlayer = g.activePlayer;
    let allPlayers = g.allPlayers;

    LoadItems();
    LoadRunes();
    LoadBuild();
    LoadChampion(activePlayer.championId);

    await AssignChampion(g);

    let st = activePlayer.champion.stats;

    // let sft: Record<string, { long: string; short: string; }> = {
    //     Gnar: { long: "Gnar", short: "MegaGnar" },
    //     Elise: { long: "Elise", short: "EliseMelee" },
    //     Jayce: { long: "JayceRanged", short: "Jayce" },
    //     Nidalee: { long: "Nidalee", short: "NidaleeMelee" }
    // };

    // let cpn = activePlayer.championName as keyof typeof sft;
    // let chd = sft[cpn]?.[activePlayer.championStats.attackRange > 325 ? "long" : "short"];
    // if (chd) { activePlayer.champion.id = chd; }

    // if (Object.keys(_Champion as LocalChampion)[0] !== activePlayer.champion.id) { return undefined; }

    let base = BaseStats(st, activePlayer.level);
    activePlayer.baseStats = base;

    if (g.statbased && w) {
        let x = await AssignItemStats(g);
        let a = st.attackspeedperlevel * (activePlayer.level - 1) * (0.7025 + 0.0175 * (activePlayer.level - 1));
        activePlayer.championStats.attackSpeed = st.attackspeed * (1 + (x + a) / 100);
    }

    let hx;
    let fx;

    if (!rec && w && t) {
        fx = structuredClone(g);
        hx = await Test(fx, rec, t);
    }

    Recm = Recommendation(activePlayer.champion.id, g.position) as string[];
    if (w) {
        let l = activePlayer.items;
        Recm = Recm.filter(item => !l.includes(item));
        l.forEach(key => {
            if (key in j) {
                delete j[key];
            }
        });
    }
    if (rec && w) { for (let p of Recm) { j[p] = 0; } }

    activePlayer.bonusStats = BonusStats(base, activePlayer.championStats);
    activePlayer.relevant = {
        abilities: FilterAbilities(activePlayer.championId) || { min: [], max: [] },
        items: FilterItems(activePlayer.items) || { min: [], max: [] },
        runes: FilterRunes(activePlayer.runes) || { min: [], max: [] },
        spell: { min: ["SummonerDot"], max: [] }
    };

    for (let player of allPlayers) {
        // player.dragon = Dragon(events, all, player.team); Assign Later
        player.baseStats = BaseStats(player.champion.stats, player.level);
        player.championStats = await PlayerStats(player.baseStats, player.items);
        player.bonusStats = BonusStats(player.baseStats, player.championStats);

        let stats = AllStats(player, activePlayer);

        let ablt = activePlayer.abilities;
        let relv = activePlayer.relevant;

        player.damage = {
            abilities: Abilities(stats, ablt),
            items: Items(relv.items.min, stats),
            runes: Runes(relv.runes.min, stats),
            spell: Spell(relv.spell.min, activePlayer.level)
        }
        if (hx) {
            let o = hx.allPlayers.filter(p => p.team !== activePlayer.team)[g.allPlayers.indexOf(player)].damage;
            let s = Tool(o, player.damage);
            player.tool = {
                dif: s.dif,
                max: o,
                sum: s.sum
            }
        };
    }

    if (rec && w && Recm) {
        for (let id of Recm) {
            for (let player of g.allPlayers) {
                let a = structuredClone(g);
                let b = await Test(a, rec, id);
                let c = b?.allPlayers.filter(p => p.team !== activePlayer.team)[g.allPlayers.indexOf(player)].damage as Damages;
                let d = Tool(c, player.damage);
                j[id] += d.sum;
            }
        }

        t = Object.entries(j).reduce((m, [k, v]) => v > j[m] ? k : m, Object.keys(j)[0]);

        for (let player of g.allPlayers) {
            let a = structuredClone(g);
            let b = await Test(a, rec, t);
            let c = b?.allPlayers.filter(p => p.team !== activePlayer.team)[g.allPlayers.indexOf(player)].damage as Damages;
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
    return g as CalculatorProps;
}

const ItemActiveness = (i: string): boolean => {
    if (!_Items) { return false }
    let y = Object.keys(_Items.data);
    return y.includes(i);
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
    if (w) {
        if (c.length == 0) { c = Object.keys(Positions)[2] }
        let d = Positions[c as keyof typeof Positions];
        let z = w[d as keyof typeof w];
        return z;
    }
    else { return [] }
}

const AssignStats = async (key: string, s: CalculatorProps["activePlayer"], a: string[]): Promise<number> => {
    let e = await EvaluateItemStats(key) as EvalItemStats;
    let q = 0;
    if (e) {
        if (ToolKeyless[key]) { ToolKeyless[key](s); }
        for (let [k, v] of Object.entries(e.stats.mod)) {
            let d = k as keyof AllPropsCS;
            if (d == "attackSpeed") { q += parseFloat(v as string); }
            if (typeof (v) == "string") { v = parseFloat(v); }
            else if (!v) { v = 0; }
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
                    else { s.championStats[d] += v }
                }
                else { s.championStats[d] += v }
            };
        }
    }
    return q
}

const Test = async (g: CalculatorProps, rec: boolean, t: string): Promise<CalculatorProps> => {
    g.activePlayer.items.push(t);
    await AssignStats(t, g.activePlayer, g.activePlayer.items);
    let k = await Calculator(g, rec, t, false);
    return k as CalculatorProps;
}

export const AllStats = (player: CalculatorProps["allPlayers"][number], activePlayer: CalculatorProps["activePlayer"]): AllStatsProps => {
    let acs = activePlayer.championStats;
    let abs = activePlayer.bonusStats;
    let abt = activePlayer.baseStats;

    let pcs = player.championStats;
    let pbs = player.bonusStats;
    let pbt = player.baseStats;

    let [acpMod, pphyMod, pmagMod, pgenMod] = [1, 1, 1, 1];

    const chspec: Record<string, () => void> = {
        Kassadin: () => pmagMod -= 0.1,
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

    let c = acs.armorPenetrationPercent;
    let d = acs.magicPenetrationPercent;
    let a = (100 - c) / 100;
    let b = (100 - d) / 100;

    let f: boolean = c > 0 && c < 1;
    let e: boolean = d > 0 && d < 1;

    let rar = Math.max(0, pcs.armor * (f ? c : a) - acs.physicalLethality);
    let rmr = Math.max(0, pcs.magicResist * (e ? d : b) - acs.magicPenetrationFlat);

    let physical = 100 / (100 + rar);
    let magic = 100 / (100 + rmr);

    let adp = 0.35 * abs.attackDamage >= 0.2 * acs.abilityPower;
    let add = adp ? physical : magic;

    // let sft: Record<string, { long: string; short: string; }> = {
    //     Gnar: { long: "Gnar", short: "MegaGnar" },
    //     Elise: { long: "Elise", short: "EliseMelee" },
    //     Jayce: { long: "JayceRanged", short: "Jayce" },
    //     Nidalee: { long: "Nidalee", short: "NidaleeMelee" }
    // };

    // let championName = activePlayer.championName as keyof typeof sft;
    // let chd = sft[championName]?.[acs.attackRange > 350 ? "long" : "short"];
    // if (chd) { activePlayer.champion.id = chd; }

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
            steelcaps: player.items.find(item => item == "3047") ? 0.88 : 1,
            rocksolid: player.items.filter(item => ["3143", "3110", "3082"].includes(item)).reduce((t) => t + (pcs.maxHealth / 1000 * 3.5), 0),
            randuin: player.items.find(item => item == "3143") ? 0.7 : 1
        }
    }
}

const FilterRunes = (runes: string[]): RelevantProps | void => {
    if (!_Runes) { return };
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
        let l: number = r.startsWith("P") ? stats.activePlayer.level : b[r].abilityLevel || 0;

        let ty = y?.type;
        let ar = y?.area;

        if (y && l > 0) {
            let min = y.min?.[l - 1];
            let max = y.max?.[l - 1];

            let [n, m] = Evaluate(min, max, stats);

            if (ty && typ[ty]) { typ[ty](n, m) }

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

const Items = (items: string[], stats: AllStatsProps): Record<string, Damage> => {
    let t: Record<string, Damage> = {};

    let f = stats.activePlayer.form;

    for (let k of items) {
        let item = _Items?.data[k];
        if (item) {
            let min = item.min[f];
            let max = item.max?.[f];
            let total = item.effect?.[stats.activePlayer.level - 1];
            let [n, m] = Evaluate(min, max, stats, total ? { total } : undefined);
            t[k] = {
                min: n,
                max: m,
                type: item.type,
                name: item.name,
                onhit: item.onhit
            };
        }
    }
    return t;
}

const Runes = (runes: string[], stats: AllStatsProps): Record<string, Damage> => {
    if (!runes.length || !_Runes) { return {}; }

    let t: Record<string, Damage> = {};

    for (let k of runes) {
        let rune = _Runes.data[k];
        if (rune) {
            let min = rune.min[stats.activePlayer.form];
            let [n] = Evaluate(min, null, stats);
            t[k] = {
                min: n,
                type: rune.type == "adaptative" ? stats.activePlayer.adaptative.type : rune.type,
                name: rune.name
            };
        }
    }
    return t;
}

const FilterItems = (items: string[]): RelevantProps | void => {
    if (!_Items) { return }
    let min: string[] = [];
    let max: string[] = [];
    let y = _Items.data;
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

const FilterAbilities = (id: string): RelevantProps | void => {
    let x = _Champion?.[id];
    let w: string[] = [];
    if (x) {
        for (let [k, v] of Object.entries(x)) { if (v.max?.length) { w.push(k) } };
        let t = Object.keys(x);
        return {
            min: t.concat(["A", "C"]),
            max: w
        };
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

const LoadBuild = (): void => {
    if (_Build) { return }
    else {
        _Build = JSON.parse(readFileSync(`${process.cwd()}/cache/builds.json`, "utf-8")) as ScrapProps;
    }
}

const LoadRunes = (): void => {
    if (_Runes) { return }
    else {
        _Runes = JSON.parse(readFileSync(`${Effects}/runes.json`, "utf-8")) as LocalRunes;
    }
}