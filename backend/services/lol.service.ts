import dotenv from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { ChampionIDs, Champions, EvalItemStats, FullChampions, Items, KeyReplaces, RunesReforged, TargetChampion, TargetItem } from "./types-realtime";
import { WebScraper } from "./scrap.service";

dotenv.config()

const cacheDIR: string = `${process.cwd()}/cache`;

const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/data/${process.env.LANGUAGE}`

export const RiotAPI = async (file: string): Promise<any | void> => {
    let url = `${riotCDN}/${file}.json`;
    try {
        let request = await fetch(url)
        let response = await request.json();
        return response;
    }
    catch (e) {
        console.log(e)
    }
};

const Delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Cache = (x: string) => JSON.parse(readFileSync(`${cacheDIR}/${x}.json`, "utf-8"));

const champIDs = Cache("ids") as ChampionIDs;

let ChampionCache: Record<string, TargetChampion> = {};
let ItemCache: Record<string, TargetItem> = {};
let StatsCache: Record<string, EvalItemStats> = {};

const UpdateChampionIDs = async () => {
    try {
        let a = Cache("lang") as string[];
        const b = `${cacheDIR}/ids.json`;
        let c: Record<string, Record<string, string>> = {};
        for (let i = 0; i < a.length; i++) {
            const d = a[i];
            const f = await RiotAPI("champion") as FullChampions;
            const g = f.data;
            for (const h in g) {
                const j = g[h].name;
                if (!c[h]) { c[h] = {}; }
                c[h][d] = j;
            }
        }
        let k: Record<string, Record<string, string>> = {};
        if (existsSync(b)) { k = JSON.parse(readFileSync(b, 'utf-8')); }
        Object.keys(c).forEach(l => {
            if (!k[l]) { k[l] = {}; }
            Object.assign(k[l], c[l]);
        });
        writeFileSync(b, JSON.stringify(k, null, 2));
        console.log('Champion IDs data has been written to ids.json');
    } catch (e) { console.error('Error:', e); }
};

export const UpdateCache = async () => {
    const s = new Date();
    await UpdateChampionIDs();
    let p = process.env.LOL_VERSION;
    for (let k of Object.keys(champIDs)) {
        let j = Cache(`champions/${k}`) as Champions;
        if (j.version !== p) {
            let x = await RiotAPI(`champion/${k}`) as Champions;
            if (x) {
                writeFileSync(`${cacheDIR}/champions/${k}.json`, JSON.stringify(x), "utf-8");
                console.log(`${k}.json updated`);
            }
            await Delay(400);
        }
    }
    let h = Cache("item") as Items;
    if (h.version !== p) {
        let y = await RiotAPI("item") as Items;
        if (y) {
            writeFileSync(`${cacheDIR}/item.json`, JSON.stringify(y), "utf-8");
            CacheItemStats();
        }
    }
    let w = Cache("runesReforged") as RunesReforged;
    if (w.version !== p) {
        let q = await RiotAPI("runesReforged") as RunesReforged;
        let z = {
            version: p,
            data: q
        }
        if (q) { writeFileSync(`${cacheDIR}/runesReforged.json`, JSON.stringify(z), "utf-8"); }
    }
    let c = Cache("champion");
    if (c.version !== p) {
        let d = await RiotAPI("champion") as FullChampions;
        if (d) { writeFileSync(`${cacheDIR}/champion.json`, JSON.stringify(d), "utf8"); }
    }
    await WebScraper();
    const n = new Date();
    const t = (n.getTime() - s.getTime()) / 1000;
    console.log(`Cache update completed in ${t} seconds.`);
};

const GetChampionID = (x: string): string | void => {
    for (let [k, v] of Object.entries(champIDs)) {
        for (let t of Object.values(v)) {
            if (t == x) { return k; }
        }
    }
}

export const ChampionAPI = async (cn: string): Promise<TargetChampion | void> => {
    cn = GetChampionID(cn) as string || cn;
    if (ChampionCache[cn]) { return ChampionCache[cn]; }
    let x = Cache(`champions/${cn}`) as Champions || await RiotAPI(`champion/${cn}`) as Champions;
    let y = x?.data[cn];
    if (y) {
        let z = {
            id: y.id,
            name: y.name,
            stats: y.stats,
            spells: y.spells.map(z => ({
                id: z.id,
                name: z.name,
                description: z.description,
                cooldown: z.cooldown,
            })),
            passive: y.passive
        } as TargetChampion;
        ChampionCache[cn] = z;
        return z;
    }
}

export const ItemAPI = async (itemName: string): Promise<TargetItem | void> => {
    if (ItemCache[itemName]) { return ItemCache[itemName]; }
    let x = Cache("item") as Items || await RiotAPI("item") as Items;
    let y = x?.data[itemName];
    if (y) {
        let z = {
            name: y.name,
            description: y.description,
            stats: y.stats,
            gold: y.gold,
            maps: y.maps,
            from: y.from
        }
        ItemCache[itemName] = z;
        return z;
    }
}

export const AllRunes = async (): Promise<RunesReforged> => {
    let x = Cache("runesReforged") as RunesReforged || await RiotAPI("runesReforged") as RunesReforged;
    return x;
}

export const AllChampions = async (): Promise<FullChampions> => {
    let x = Cache("champion") as FullChampions || await RiotAPI("champion") as FullChampions;
    return x;
}

export const EveryChampion = async (): Promise<Record<string, { name: string }>> => {
    let x = Cache("champion") as FullChampions || await RiotAPI("champion") as FullChampions;
    let y: Record<string, { name: string }> = {};
    for (let [k, v] of Object.entries(x.data)) {
        y[k] = { name: v.name };
    }
    return y;
}

export const AllItems = async (): Promise<Items> => {
    let x = Cache("item") as Items || await RiotAPI("item") as Items;
    return x;
}

export const AllStats = async (): Promise<Record<string, EvalItemStats>> => {
    let x = Cache("stats") as Record<string, EvalItemStats>;
    return x;
}

export const CacheItemStats = async (): Promise<any> => {
    let q = Cache("replacements") as KeyReplaces;
    let k = q.percentages;
    let r = q.keys;
    let e = q.extras;
    let u = ["attention", "buffedStat", "nerfedStat", "ornnBonus"];
    let p = Cache("item") as Items;

    let h: Record<string, EvalItemStats> = {};

    for (let item in p.data) {
        let x = await ItemAPI(item) as TargetItem;
        let y = x.description;

        let a: RegExp = /<(attention|buffedStat|nerfedStat|ornnBonus)>(.*?)<\/(attention|buffedStat|nerfedStat|ornnBonus)>/g
        let b: RegExp = /(.*?)<br>/g;
        let c: RegExp = /^\s*\d+\s*%?\s*/;
        let d: RegExp = /<\/?[^>]+(>|$)/g;

        let m: RegExpExecArray | null;
        let n: any;

        let res: Record<string, any> = {};
        let raw: Record<string, any> = {};

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
                        let h = parseFloat(v) + "%";
                        res[j] = h;
                        raw[j] = h;
                    }
                    else {
                        res[j] = parseFloat(v);
                        raw[j] = parseFloat(v);
                    };
                }
            }
            n = undefined;
        }

        for (let [f, g] of Object.entries(res)) {
            if (f == "Magic Penetration") {
                if (typeof (g) == "string") { res["magicPenetrationPercent"] = -1 * parseInt(g.replace("%", "")) / 100 }
                else { res["magicPenetrationFlat"] = g; }
            }
            else if (r[f]) { res[r[f]] = g }
            delete res[f];
        }

        if (e[item]) { for (let [p, q] of Object.entries(e[item])) { res[p] = res[p] ? res[p] += q : q; } }

        h[item] = {
            name: x.name,
            stats: {
                raw: raw,
                mod: res,
            },
            stack: x.gold.total <= 1450,
            from: x.from,
            gold: x.gold,
            maps: x.maps
        } as EvalItemStats;
    }
    writeFileSync(`${cacheDIR}/stats.json`, JSON.stringify(h), "utf8");
}

export const EvaluateItemStats = async (item: string): Promise<EvalItemStats> => {
    if (StatsCache[item]) { return StatsCache[item] as EvalItemStats; };
    let t = Cache("stats") as Record<string, EvalItemStats>;
    StatsCache[item] = t[item as keyof typeof t];
    return t[item as keyof typeof t];
}