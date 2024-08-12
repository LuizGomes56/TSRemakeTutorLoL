import { useEffect, useState } from "react";
import { champion, EndPoint } from "../../../constants";

type ChampionResponse = Record<string, { name: string }>

const FetchChampions = async function () {
    try {
        let x = await fetch(EndPoint + "/api/lol/all/champions", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as ChampionResponse;
        if (y) { return y; }
        else { throw new Error("Unable to load champions") }
    }
    catch (e) { console.log(e); }
    return null;
}

export default function DropdownChampions() {
    let [cell, setCell] = useState<ChampionResponse | null>(null);

    useEffect(() => {
        LoadChampions()
    }, []);

    const LoadChampions = async () => {
        let x = await FetchChampions();
        setCell(x);
    }

    return (
        <div className="flex flex-col max-h-32 overflow-y-auto">
            {cell && Object.keys(cell).map((x, i) => {
                let c = cell[x];
                return (
                    <div key={x + i} className="p-1 flex gap-2 items-center">
                        <img className="h-6" src={champion(x)} alt="" />
                        <span className="dropshadow text-zinc-300 text-sm">{c.name}</span>
                    </div>
                )
            })}
        </div>
    )
}