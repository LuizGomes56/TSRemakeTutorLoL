import dotenv from "dotenv";
import { Champion, RequestChampion } from "../interfaces/champion";
import { ItemAPIProps, RequestItem } from "../interfaces/item";
import { readFileSync, writeFileSync } from "fs";

dotenv.config()

let _Champions: void | RequestChampion;
let _Items: void | RequestItem;

const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/data/${process.env.LANGUAGE}`

export const UpdateCache = async (): Promise<void> => {
    let files = ["champion", "item"];
    for (let file of files) {
        let x: any = JSON.parse(readFileSync(`${process.cwd()}/cache/${file}.json`, "utf-8"))
        if (x.version !== process.env.LOL_VERSION) {
            let k = await RiotAPI(file);
            writeFileSync(`${process.cwd()}/cache/${file}.json`, JSON.stringify(k), "utf-8");
        }
    }
}

export const FetchCache = async (file: string): Promise<any | void> => {
    try {
        let y = readFileSync(`${process.cwd()}/cache/${file}.json`, "utf-8");
        let x = JSON.parse(y);
        if (x.version !== process.env.LOL_VERSION) {
            await UpdateCache();
            y = readFileSync(`${process.cwd()}/cache/${file}.json`, "utf-8");
            x = JSON.parse(y);
        }
        return x;
    } catch (e) {
        console.log(e);
    }
};

export const ChampionAPI = async (championName: string): Promise<Champion | void> => {
    if (!_Champions) { _Champions = await FetchCache("champion") as RequestChampion }
    if (_Champions.data[championName]) { return _Champions.data[championName] as Champion; }
    else {
        for (let key in _Champions.data) {
            if (_Champions.data[key].name === championName) { return _Champions.data[key] as Champion; }
        }
    }
}

export const ItemAPI = async (itemName: string): Promise<ItemAPIProps | void> => {
    if (!_Items) { _Items = await FetchCache("item") as RequestItem }
    if (_Items.data[itemName]) { return _Items.data[itemName] as ItemAPIProps; }
    else {
        for (let key in _Items.data) {
            if (_Items.data[key].name === itemName) { return _Items.data[key] as ItemAPIProps; }
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