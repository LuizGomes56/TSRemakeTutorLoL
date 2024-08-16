import { useEffect, useState } from "react";
import { champion, EndPoint, Style } from "../../../constants";
import { fuzzySearch } from "../../../types-calculator";

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

export default function DropdownChampions({ visible, onChampionSelect, searchQuery }: { visible: boolean, onChampionSelect: (championId: string, championName: string) => void, searchQuery: string }) {
    let [cell, setCell] = useState<ChampionResponse | null>(null);

    useEffect(() => {
        LoadChampions()
    }, []);

    const LoadChampions = async () => {
        let x = await FetchChampions();
        setCell(x);
    }

    const Selection = (championId: string, championName: string) => {
        onChampionSelect(championId, championName);
    }

    return (
        <div className={`${Style.dropdown.main} ${visible ? "" : "hidden"}`}>
            {cell && Object.keys(cell).filter(championId => fuzzySearch(searchQuery, cell[championId].name)).map((x, i) => {
                let c = cell[x];
                return (
                    <div key={x + i} className={Style.dropdown.cell} onClick={() => Selection(x, c.name)}>
                        <img className={Style.dropdown.image} src={champion(x)} alt="" />
                        <span className={Style.dropdown.text}>{c.name}</span>
                    </div>
                )
            })}
        </div>
    )
}