import { useEffect, useState } from "react";
import { EndPoint, stat } from "../constants";
import { ChampionStats } from "../types-calculator";
import { CoreStats } from "../types-realtime";

type Replaces = { name: string, img: string, key: string, letter: boolean }[];

const FetchReplacements = async (): Promise<Replaces | null> => {
    try {
        let x = await fetch(EndPoint + "/api/lol/replacements", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as Replaces;
        return y;
    }
    catch (e) { console.error(e); }
    return null;
}

export default function EnemyReplacements({ championStats, onStatChange, inputDisabled }: { championStats: CoreStats, onStatChange: (key: keyof ChampionStats, value: number, level?: boolean) => void, inputDisabled: boolean }) {
    let [replacements, setReplacements] = useState<Replaces | null>(null);

    useEffect(() => {
        LoadReplacements();
    }, [])

    const LoadReplacements = async () => {
        let a = await FetchReplacements() as Replaces;
        if (a) { setReplacements(a); }
    }

    const StatChange = (k: keyof CoreStats, t?: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value === "" ? 0 : parseFloat(e.target.value);
        if (!isNaN(v)) {
            if (t) { v = Math.max(1, Math.min(18, Math.floor(v))); }
            onStatChange(k, v, t);
        }
    }

    const LevelKeydown = (t: boolean) => (d: React.KeyboardEvent<HTMLInputElement>) => {
        if (d.ctrlKey && ["a", "c", "v", "x"].includes(d.key.toLowerCase())) { return; }
        const a = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        if (a.includes(d.key)) { return; }
        const b = d.currentTarget.value;
        const c = b + d.key;
        if (t) { if (!/^\d+$/.test(d.key) || (c.length > 2) || parseInt(c, 10) > 18 || parseInt(c, 10) < 1) { d.preventDefault(); } }
        else { if (!/^\d$/.test(d.key)) { d.preventDefault(); } }
    };

    return (
        <div className="px-12 flex flex-col gap-1 bg-slate-900 pb-4">
            {replacements && replacements.map((x, i) => {
                let v = x.name + i;
                let t = x.key == "level";
                let w = t ? 18 : championStats[x.key as keyof CoreStats];
                return ["level", "maxHealth", "armor", "magicResist"].includes(x.key) && (
                    <div key={v} className="flex items-center h-7 gap-4 justify-between">
                        <div className="md:flex-auto items-center">
                            <div className="flex gap-2 items-center">
                                <span className="relative flex items-center justify-center cursor-pointer">
                                    <img src={stat(x.img)} alt="" className="h-4 min-w-4 select-none shade" />
                                    {x.letter && <h2 className="text-xs select-none text-white absolute font-bold letter-shade">%</h2>}
                                </span>
                                <span className="dropshadow text-sky-300 text-sm font-inter">{x.name}</span>
                            </div>
                        </div>
                        <label htmlFor={v}>
                            <input
                                disabled={inputDisabled}
                                onKeyDown={LevelKeydown(t)}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                className="focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm rounded bg-slate-800 h-7 text-center text-zinc-300 w-16"
                                id={v}
                                placeholder={w ? Math.round(w).toString() : "0"}
                                onChange={StatChange(x.key as keyof CoreStats, t)}
                            />
                        </label>
                    </div>
                )
            })}
        </div>
    )
}