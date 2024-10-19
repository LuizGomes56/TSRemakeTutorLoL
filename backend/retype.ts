import { readdirSync, readFileSync, writeFileSync } from "fs";
import { LocalChampion } from "./services/types-realtime";

const Retype = () => {
    let x: string[] = readdirSync("champions");
    for (let y of x) {
        console.log(y);
        let z: LocalChampion = JSON.parse(readFileSync(`champions/${y}`, "utf-8"));
        let v = y.replace(".json", "");
        let u = z[v];
        console.log(u);
        writeFileSync(`retyped/${y}`, JSON.stringify(u), "utf-8");
    }
}

Retype();