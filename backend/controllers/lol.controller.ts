import { Request, Response, NextFunction } from 'express';
import { AllChampions, AllItems, AllStats, Cache, ChampionAPI, EveryChampion, UpdateCache } from '../services/lol.service';
import dotenv from "dotenv";
import path from "path";
import { Champions, EvalItemStats, Items, KeyReplaces, LocalRunes, RunesReforged } from '../services/types-realtime';
import { readFileSync } from 'fs';
const download = require("download");

dotenv.config();

const imgDIR: string = path.join(process.cwd(), '..', 'frontend', 'public', 'img');
const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/img`;
const msg: string = "Downloaded all files in queue.";
const end: string = "Download Completed: ";

export const FetchPassives = async () => {
    try {
        let c = await AllChampions();
        for (let k in c?.data) {
            let t = await ChampionAPI(k);
            if (!t) {
                console.log(msg);
                return;
            }
            let x = t.passive.image.full;
            let url = `${riotCDN}/passive/${x}`;
            let f = `${imgDIR}/spell`;
            await download(url, f, { filename: t.id + "P.png" }).then(() => console.log(end + x));
        }
    }
    catch (e) { console.log(e, msg); }
};

export const ControllerPassives = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchPassives();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const FetchSpells = async () => {
    try {
        let c = await AllChampions();
        let i: number = 0;
        let j = ["Q", "W", "E", "R"];
        for (let k in c?.data) {
            let t = await ChampionAPI(k);
            if (!t) {
                console.log(msg);
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
    }
    catch (e) { console.log(e, msg); };
}

export const ControllerSpells = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchSpells();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const FetchChampions = async () => {
    try {
        let c = await AllChampions();
        for (let k in c?.data) {
            let t = await ChampionAPI(k);
            if (!t) {
                console.log(msg);
                return;
            }
            let url = `${riotCDN}/champion/${t.id}.png`;
            let f = `${imgDIR}/champion`;
            await download(url, f).then(() => console.log(end + t.name));
        }
    }
    catch (e) { console.log(e, msg); };
}

export const ControllerChampions = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchChampions();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const ControllerItems = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchItems();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const FetchItems = async () => {
    try {
        let c = await AllItems() as Items;
        for (let k in c?.data) {
            let url = `${riotCDN}/item/${k}.png`;
            let f = `${imgDIR}/item`;
            await download(url, f).then(() => console.log(end + k));
        }
    }
    catch (e) { console.log(e, msg); };
}

export const FetchArts = async () => {
    try {
        let c = await AllChampions();
        for (let k of Object.keys(c?.data)) {
            let t = await Cache(`champions/${k}`) as Champions;
            for (let y of t.data[k].skins) {
                let r = y.num;
                for (let w of ["centered", "splash"]) {
                    let f = `${imgDIR}/${w}`;
                    let url = `${process.env.DD_ENDPOINT}/img/champion/${w}/${k}_${r}.jpg`;
                    try { await download(url, f).then(() => console.log(k + r)); }
                    catch (e) { console.error(`Failed to download ${url}:`, e); }
                }
            }
        }
    }
    catch (e) { console.log(e, msg); };
}

export const ControllerArts = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchArts();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const ControllerRunes = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchRunes();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const FetchRunes = async () => {
    try {
        let c = await Cache("runesReforged");
        let j: string = `${process.env.CANISBACK_ENDPOINT}`;
        for (let k in c) {
            let r = c[k];
            let url = `${j}/${r.icon}`;
            let h = `${imgDIR}/rune`;
            await download(url, h).then(() => console.log(end + k));
            if (r.slots.length > 0) {
                for (let s of r.slots) {
                    for (let v of s.runes) {
                        let url = `${j}/${v.icon}`;
                        let f = `${imgDIR}/rune`;
                        try { await download(url, f, { filename: v.id + ".png" }).then(() => console.log(end + v.id)); }
                        catch (e) { console.log(e) }
                    }
                }
            }
        }
    }
    catch (e) { console.log(e, msg); };
}

export const FetchCache = async () => {
    let x: string = "Updated all Cache Files";
    await UpdateCache().then(() => console.log(x));
}

export const ControllerCache = async (req: Request, res: Response, next: NextFunction) => {
    const s = new Date();
    try {
        await FetchCache();
        const n = new Date();
        const t = (n.getTime() - s.getTime()) / 1000;
        res.status(200).json({ success: true, duration: t })
    }
    catch (e) {
        next(e);
        res.status(404).json({ success: false })
    }
}

export const ItemList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let x = await AllStats() as Record<string, EvalItemStats>;
        res.status(200).json(x);
    }
    catch (e) {
        res.status(404).json({ success: false, message: "Unable to reach item file." });
        next(e);
    }
}

export const ChampionList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let x = await EveryChampion() as Record<string, { name: string }>;
        res.status(200).json(x);
    }
    catch (e) {
        res.status(404).json({ success: false, message: "Unable to reach champion file." });
        next(e);
    }
}

export const RuneList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let x = Cache("runesReforged") as RunesReforged;
        let t: Record<string, { name: string }> = {};
        let y = x.data;
        for (let z of y) {
            for (let w of z.slots) {
                for (let q of w.runes) {
                    t[q.id] = { name: q.name };
                }
            }
        }
        let r = JSON.parse(readFileSync(`${process.cwd()}/effects/runes.json`, "utf-8")) as LocalRunes;
        let u = Object.keys(r.data);
        let v = ["8017", "8138", "8233", "8008", "8120", "8136", "8143", "8236", "8010", "8369"];
        let s = u.concat(v);
        for (let g of Object.keys(t)) { if (!s.includes(g)) { delete t[g]; } }
        res.status(200).json(t);
    }
    catch (e) {
        res.status(404).json({ success: false, message: "Unable to reach rune file." });
        next(e);
    }
}

export const ControllerReplacements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let x = Cache("replacements") as KeyReplaces;
        let y = x.inputs;
        res.status(200).json(y);
    }
    catch (e) {
        res.status(404).json({ success: false, message: "Unable to reach replacements file." });
        next(e);
    }
}

export const ControllerUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const Functions = [FetchCache, FetchPassives, FetchSpells, FetchRunes, FetchChampions, FetchItems, FetchArts];
    const f = new Date();
    for (const fn of Functions) {
        try { await fn(); }
        catch (e) {
            next(e)
            res.status(404).json({ success: false, message: "Unable to update the whole app.", origin: fn.name });
            break;
        }
    }
    const n = new Date();
    const t = (n.getTime() - f.getTime()) / 1000;
    const m = Math.floor(t / 60);
    const s = Math.round(t % 60);
    console.log(`Version update completed in ${m}m and ${s}s.`);
    res.status(200).json({ success: true, message: msg });
}