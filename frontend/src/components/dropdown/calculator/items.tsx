import { useEffect, useState } from "react";
import { EndPoint, item, Style } from "../../../constants"
import { EvalItemStats } from "../../../types-realtime";
import { fuzzySearch } from "../../../types-calculator";

const FetchItems = async (): Promise<Record<string, EvalItemStats> | null> => {
    try {
        let x = await fetch(EndPoint + "/api/lol/all/items", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as Record<string, EvalItemStats>;;
        return y;
    }
    catch (e) { console.log(e); }
    return null;
}

export default function DropdownItems({ visible, onItemSelect, searchQuery }: { visible: boolean, onItemSelect: (itemId: string) => void, searchQuery: string }) {
    let [cells, setCells] = useState<Record<string, EvalItemStats> | null>(null);

    useEffect(() => {
        LoadItems();
    }, [])

    const LoadItems = async () => {
        let a = await FetchItems();
        if (a) setCells(a);
    }

    return (
        <div className={`${Style.dropdown.main} ${visible ? "" : "hidden"}`}>
            {cells && Object.keys(cells).filter(itemId => fuzzySearch(searchQuery, cells[itemId].name)).map((x, i) => {
                let c = cells[x];
                return c.gold.purchasable && c.maps["11"] && (
                    <div key={c.name + x + i} className={Style.dropdown.cell} onClick={() => onItemSelect(x)}>
                        <img className={Style.dropdown.image} src={item(x)} alt="" />
                        <span className={Style.dropdown.text}>{c.name}</span>
                    </div>
                )
            })}
        </div>
    )
}