import { useEffect, useState } from "react";
import { EndPoint, rune, Style } from "../../../constants"
import { fuzzySearch } from "../../../types-calculator";

type RuneResponse = Record<string, { name: string }>;

const FetchRunes = async (): Promise<RuneResponse | null> => {
    try {
        let x = await fetch(EndPoint + "/api/lol/all/runes", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as RuneResponse;;
        return y;
    }
    catch (e) { console.log(e); }
    return null;
}

export default function DropdownRunes({ visible, onRuneSelect, searchQuery }: { visible: boolean, onRuneSelect: (runeId: string) => void, searchQuery: string }) {
    let [cells, setCells] = useState<RuneResponse | null>(null);

    useEffect(() => {
        LoadItems();
    }, [])

    const LoadItems = async () => {
        let a = await FetchRunes();
        if (a) setCells(a);
    }

    return (
        <div className={`${Style.dropdown.main} ${visible ? "" : "hidden"}`}>
            {cells && Object.keys(cells).filter(runeId => fuzzySearch(searchQuery, cells[runeId].name)).map((x, i) => {
                let c = cells[x];
                return (
                    <div key={c.name + x + i} className={Style.dropdown.cell} onClick={() => onRuneSelect(x)}>
                        <img className={Style.dropdown.image} src={rune(x)} alt="" />
                        <span className={Style.dropdown.text}>{c.name}</span>
                    </div>
                )
            })}
        </div>
    )
}