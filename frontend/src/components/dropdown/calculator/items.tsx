import { useEffect, useState } from "react";
import { EndPoint, item } from "../../../constants"
import { EvalItemStats } from "../../../types-realtime";

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

export default function DropdownItems() {
    let [cells, setCells] = useState<Record<string, EvalItemStats> | null>(null);

    useEffect(() => {
        LoadItems();
    }, [])

    const LoadItems = async () => {
        let a = await FetchItems();
        if (a) setCells(a);
    }

    return (
        <div className="flex flex-col max-h-32 overflow-y-auto">
            {cells && Object.keys(cells).map((x, i) => {
                let c = cells[x];
                return (
                    <div key={c.name + x + i} className="p-1 flex gap-2 items-center">
                        <img className="h-6" src={item(x)} alt="" />
                        <span className="text-zinc-300 dropshadow text-sm">{c.name}</span>
                    </div>
                )
            })}
        </div>
    )
}