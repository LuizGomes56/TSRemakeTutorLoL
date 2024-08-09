import dotenv from "dotenv";
import { AllChampions, AllItems } from "./lol.service";
import { FullChampions, Items, ScrapProps } from "./interfaces";
import { load } from "cheerio";
import { writeFileSync } from "fs";

dotenv.config();

const file = `${process.cwd()}/cache/builds.json`;

let j = ["top", "jungle", "mid", "adc", "support"] as const;

export const WebScraper = async (): Promise<void> => {
    let c = await AllChampions() as FullChampions;
    let o = {} as ScrapProps;

    for (let k in c.data) {
        if (!o[k]) { o[k] = {} as Record<typeof j[number], string[]>; }
        for (let p of j) {
            let url = `${process.env.SCRAP_ENDPOINT}/${k}/build/${p}`;
            let x = await fetch(url);
            let html = await x.text();
            const $ = load(html);
            let d = $(".m-1q4a7cx");
            let t = new Array<string>();
            let r = d.eq(3);
            r.find("img").each((i, e) => {
                let v = $(e);
                let a = v.attr("alt");
                if (a) { t.push(a); }
            });
            o[k][p] = t;
        }
    }
    RewriteKeys(o);
}

const RewriteKeys = async (x: ScrapProps): Promise<void> => {
    let y = {} as ScrapProps;
    let z = await AllItems() as Items;
    for (let [c, r] of Object.entries(x)) {
        y[c] = {
            top: [],
            jungle: [],
            mid: [],
            adc: [],
            support: [],
        };
        for (let w of Object.keys(r) as Array<typeof j[number]>) {
            for (let i of r[w]) {
                for (let [d, t] of Object.entries(z.data)) {
                    if (t.name === i) {
                        y[c][w].push(d);
                        break;
                    }
                }
            }
        }
    }
    writeFileSync(file, JSON.stringify(y, null, 2), "utf-8");
}