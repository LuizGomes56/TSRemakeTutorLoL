import { useEffect, useState } from "react";
import { EndPoint, rune } from "../../../constants"

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

export default function DropdownRunes() {
    let [cells, setCells] = useState<RuneResponse | null>(null);

    useEffect(() => {
        LoadItems();
    }, [])

    const LoadItems = async () => {
        let a = await FetchRunes();
        if (a) setCells(a);
    }

    return (
        <div className="flex flex-col max-h-32 overflow-y-auto">
            {cells && Object.keys(cells).map((x, i) => {
                let c = cells[x];
                return (
                    <div key={c.name + x + i} className="p-1 flex gap-2 items-center">
                        <img className="h-6" src={rune(x)} alt="" />
                        <span className="text-zinc-300 dropshadow text-sm">{c.name}</span>
                    </div>
                )
            })}
        </div>
    )
}