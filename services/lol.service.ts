import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { ChampionIDs, Champions, Items, TargetChampion, TargetItem } from "./interfaces";

dotenv.config()

const chacheDIR: string = `${process.cwd()}/cache`;
const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/data/${process.env.LANGUAGE}`
const champIDs = JSON.parse(readFileSync(`${chacheDIR}/ids.json`, "utf-8")) as ChampionIDs;

const Delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Cache = (x: string): Champions | Items => JSON.parse(readFileSync(`${chacheDIR}/${x}.json`, "utf-8"));

export const UpdateCache = async () => {
    const s = new Date();
    for (let k of Object.keys(champIDs)) {
        let j = JSON.parse(readFileSync(`${chacheDIR}/champions/${k}.json`, "utf-8")) as Champions;
        if (j.version !== process.env.LOL_VERSION) {
            let x = await RiotAPI(`champion/${k}`) as Champions;
            if (x) {
                writeFileSync(`${chacheDIR}/champions/${k}.json`, JSON.stringify(x), "utf-8");
                console.log(`${k}.json updated`);
            }
            await Delay(400);
        }
    }
    let h = JSON.parse(readFileSync(`${chacheDIR}/item.json`, "utf-8")) as Items;
    if (h.version !== process.env.LOL_VERSION) {
        let y = await RiotAPI("item") as Items;
        if (y) { writeFileSync(`${chacheDIR}/item.json`, JSON.stringify(y), "utf-8"); }
    }
    const n = new Date();
    const t = (n.getTime() - s.getTime()) / 1000;
    console.log(`UpdateCache completed in ${t} seconds.`);
};

export const ChampionAPI = async (championName: string): Promise<TargetChampion | void> => {
    for (let [k, v] of Object.entries(champIDs)) {
        for (let t of Object.values(v)) {
            if (t == championName) { championName = k }
        }
    }
    let x = Cache(`champions/${championName}`) as Champions || await RiotAPI(`champion/${championName}`) as Champions;
    let y = x?.data[championName];
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
            maps: y.maps
        }
    }
}

const RiotAPI = async (file: string): Promise<any | void> => {
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