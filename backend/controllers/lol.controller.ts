import { Request, Response, NextFunction } from 'express';
import { AllChampions, AllItems, ChampionAPI, RiotAPI, UpdateCache } from '../services/lol.service';
import dotenv from "dotenv";
import { Items } from '../services/interfaces';
const download = require("download");

dotenv.config();

const imgDIR: string = `${process.cwd()}/public/img`;
const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/img`;
const msg: string = "Downloaded all files in queue.";
const end: string = "Download Completed: ";

export const FetchPassives = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let c = await AllChampions();
        for (let k in c?.data) {
            let t = await ChampionAPI(k);
            if (!t) {
                res.status(403).json({ success: false });
                return;
            }
            let x = t.passive.image.full;
            let url = `${riotCDN}/passive/${x}`;
            let f = `${imgDIR}/spell`;
            await download(url, f, { filename: t.id + "P.png" }).then(() => console.log(end + x));
        }
        res.status(200).json({ success: true, message: msg });
    }
    catch (e) { next(e); }
};

export const FetchSpells = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let c = await AllChampions();
        let i: number = 0;
        let j = ["Q", "W", "E", "R"];
        for (let k in c?.data) {
            let t = await ChampionAPI(k);
            if (!t) {
                res.status(403).json({ success: false });
                return;
            }
            for (let s of t.spells) {
                let url = `${riotCDN}/spell/${s.id}.png`;
                let f = `${imgDIR}/spell`;
                await download(url, f, { filename: t.id + j[i] + ".png" }).then(() => console.log(end + s.id));
                i++;
            }
            i = 0;
        }
        res.status(200).json({ success: true, message: msg });
    }
    catch (e) { next(e) };
}

export const FetchChampions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let c = await AllChampions();
        for (let k in c?.data) {
            let t = await ChampionAPI(k);
            if (!t) {
                res.status(403).json({ success: false });
                return;
            }
            let url = `${riotCDN}/champion/${t.id}.png`;
            let f = `${imgDIR}/champion`;
            await download(url, f).then(() => console.log(end + t.name));
        }
        res.status(200).json({ success: true, message: msg });
    }
    catch (e) { next(e) };
}

export const FetchItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let c = await AllItems() as Items;
        for (let k in c?.data) {
            let url = `${riotCDN}/item/${k}.png`;
            let f = `${imgDIR}/item`;
            await download(url, f).then(() => console.log(end + k));
        }
        res.status(200).json({ success: true, message: msg });
    }
    catch (e) { next(e) };
}

export const FetchRunes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let c = await RiotAPI("runesReforged");
        let j: string = `${process.env.CANISBACK_ENDPOINT}`;
        for (let k in c) {
            let r = c[k];
            let url = `${j}/${r.icon}`;
            let h = `${imgDIR}/rune`;
            await download(url, h).then(() => console.log(end + k));
            if (r.slots.length > 0) {
                for (let s of r.slots) {
                    for (let v of s.runes) {
                        console.log(v.id);
                        // let e = [8321, 8313, 8316, 9101, 9105];
                        // if (!e.includes(parseInt(v.id))) {
                        let url = `${j}/${v.icon}`;
                        let f = `${imgDIR}/rune`;
                        await download(url, f, { filename: v.id + ".png" }).then(() => console.log(end + v.id));
                    }
                }
            }
        }
        res.status(200).json({ success: true, message: msg });
    }
    catch (e) { next(e) };
}

export const FetchCache = async (req: Request, res: Response, next: NextFunction) => {
    let x: string = "Updated all Cache Files";
    await UpdateCache().then(() => console.log(x));
    res.status(200).json({ success: true, message: x });
}

export const ItemList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let x = await AllItems() as Items;
        res.status(200).json(x);
    }
    catch (e) {
        res.status(404).json({ success: false, message: "Unable to reach item file." });
        next(e);
    }
}