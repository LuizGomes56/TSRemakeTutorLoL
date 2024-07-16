import dotenv from "dotenv";
import { Champion, RequestChampion } from "../interfaces/champion";
import { ItemAPIProps, RequestItem } from "../interfaces/item";

dotenv.config()

let Champions: void | RequestChampion;
let Items: void | RequestItem;

const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/data/${process.env.LANGUAGE}`

export const ChampionAPI = async (championName: string): Promise<Champion | void> => {
    if (!Champions) { Champions = await RiotAPI("champion") as RequestChampion }
    if (Champions.data[championName]) { return Champions.data[championName] as Champion; }
    else {
        for (let key in Champions.data) {
            if (Champions.data[key].name === championName) { return Champions.data[key] as Champion; }
        }
    }
}

export const ItemAPI = async (itemName: string): Promise<ItemAPIProps | void> => {
    if (!Items) { Items = await RiotAPI("item") as RequestItem }
    if (Items.data[itemName]) { return Items.data[itemName] as ItemAPIProps; }
    else {
        for (let key in Items.data) {
            if (Items.data[key].name === itemName) { return Items.data[key] as ItemAPIProps; }
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