import { useEffect, useState } from "react";
import { EndPoint, stat } from "./constants";
import { ChampionStats } from "./types-calculator";

const FetchReplacements = async (): Promise<Record<string, string> | null> => {
    try {
        let x = await fetch(EndPoint + "/api/lol/replacements", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as Record<string, string>;
        return y;
    }
    catch (e) { console.error(e); }
    return null;
}

export default function Replacements({ championStats }: { championStats: ChampionStats }) {
    let [replacements, setReplacements] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        LoadReplacements();
    }, [])

    const LoadReplacements = async () => {
        let a = await FetchReplacements() as Record<string, string>;
        if (a) { setReplacements(a); }
    }

    return (
        <>
            {replacements && Object.keys(replacements).map((x, i) => {
                let c = replacements[x];
                let v = x + i;
                let w = championStats[c as keyof ChampionStats];
                return (
                    <div key={v} className="flex items-center">
                        <div className="flex-auto items-center">
                            <div className="flex gap-2 items-center">
                                <img className="h-5" src={stat(x.replace(/\s+/g, ""))} alt="" />
                                <span className="text-white text-sm">{x}</span>
                            </div>
                        </div>
                        <label htmlFor={v}>
                            <input className="h-7 bg-zinc-900 rounded p-2 text-center text-zinc-300 w-20" id={v} placeholder={w.toString()} type="text" />
                        </label>
                    </div>
                )
            })}
        </>
    )
}

