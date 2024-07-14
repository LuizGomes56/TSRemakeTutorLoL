import dotenv from "dotenv";
import { Champion, RequestChampion } from "../interfaces/champion";

dotenv.config()

let Champions: void | RequestChampion;
let Items: void;

const riotCDN: string = `${process.env.DD_ENDPOINT}/${process.env.LOL_VERSION}/data/${process.env.LANGUAGE}`

export const ChampionAPI = async (championName: string): Promise<Champion | void> => {
    let x = Champions ? Champions : await RiotAPI("champion");
    if (x?.data) {
        if (x.data[championName]) { return x.data[championName] as Champion; }
        else {
            for (let key in x.data) {
                if (x.data[key].name === championName) { return x.data[key] as Champion; }
            }
        }
    }
}

const RiotAPI = async (file: string): Promise<RequestChampion | void> => {
    let url = `${riotCDN}/${file}.json`;
    // champion, item, runesReforged
    try {
        let request = await fetch(url)
        let response = await request.json() as RequestChampion;
        Champions = response
        return response;
    }
    catch (e) {
        console.log(e)
    }
};