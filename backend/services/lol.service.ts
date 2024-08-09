import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { ChampionIDs, Champions, EvalItemStats, FullChampions, Items, KeyReplaces, TargetChampion, TargetItem } from "./interfaces";
import { WebScraper } from "./scrap.service";

dotenv.config()

const chacheDIR: string = `${process.cwd()}/cache`;

const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/data/${process.env.LANGUAGE}`

const Delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Cache = (x: string) => JSON.parse(readFileSync(`${chacheDIR}/${x}.json`, "utf-8"));

const champIDs = Cache("ids") as ChampionIDs;

export const UpdateCache = async () => {
    const s = new Date();
    for (let k of Object.keys(champIDs)) {
        let j = Cache(`champions/${k}`) as Champions;
        if (j.version !== process.env.LOL_VERSION) {
            let x = await RiotAPI(`champion/${k}`) as Champions;
            if (x) {
                writeFileSync(`${chacheDIR}/champions/${k}.json`, JSON.stringify(x), "utf-8");
                console.log(`${k}.json updated`);
            }
            await Delay(400);
        }
    }
    let h = Cache("item") as Items;
    if (h.version !== process.env.LOL_VERSION) {
        let y = await RiotAPI("item") as Items;
        if (y) {
            writeFileSync(`${chacheDIR}/item.json`, JSON.stringify(y), "utf-8");
            CacheItemStats();
        }
    }
    let c = Cache("champion");
    if (c.version !== process.env.LOL_VERSION) {
        let d = await RiotAPI("champion") as FullChampions;
        if (d) { writeFileSync(`${chacheDIR}/champion.json`, JSON.stringify(d), "utf8"); }
    }
    await WebScraper();
    const n = new Date();
    const t = (n.getTime() - s.getTime()) / 1000;
    console.log(`UpdateCache completed in ${t} seconds.`);
};

export const GetChampionID = (x: string): string | void => {
    for (let [k, v] of Object.entries(champIDs)) {
        for (let t of Object.values(v)) {
            if (t == x) { return k; }
        }
    }
}

export const ChampionAPI = async (cn: string): Promise<TargetChampion | void> => {
    cn = GetChampionID(cn) as string
    let x = Cache(`champions/${cn}`) as Champions || await RiotAPI(`champion/${cn}`) as Champions;
    let y = x?.data[cn];
    if (y) {
        return {
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
        } as TargetChampion
    }
}

export const ItemAPI = async (itemName: string): Promise<TargetItem | void> => {
    let x = Cache("item") as Items || await RiotAPI("item") as Items;
    let y = x?.data[itemName];
    if (y) {
        return {
            name: y.name,
            description: y.description,
            stats: y.stats,
            gold: y.gold,
            maps: y.maps,
            from: y.from
        }
    }
}

export const AllChampions = async (): Promise<FullChampions> => {
    let x = Cache("champion") as FullChampions || await RiotAPI("champion") as FullChampions;
    return x;
}

export const AllItems = async (): Promise<Items> => {
    let x = Cache("item") as Items || await RiotAPI("item") as Items;
    return x;
}

export const AllStats = async (): Promise<Record<string, EvalItemStats>> => {
    let x = Cache("stats") as Record<string, EvalItemStats>;
    return x;
}

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

        if (e[item]) {
            for (let [p, q] of Object.entries(e[item])) {
                res[p] = res[p] ? res[p] += q : q;
            }
        }

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
    writeFileSync(`${chacheDIR}/stats.json`, JSON.stringify(h), "utf8");
}

export const EvaluateItemStats = async (item: string): Promise<EvalItemStats> => {
    let t = Cache("stats") as Record<string, EvalItemStats>;
    return t[item as keyof typeof t];
}