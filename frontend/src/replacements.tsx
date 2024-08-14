import { useEffect, useState } from "react";
import { EndPoint, Keydown, stat } from "./constants";
import { ChampionStats } from "./types-calculator";

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

export default function Replacements({ championStats, onStatChange }: { championStats: ChampionStats, onStatChange: (key: keyof ChampionStats, value: number, level?: boolean) => void }) {
    let [replacements, setReplacements] = useState<Replaces | null>(null);

    useEffect(() => {
        LoadReplacements();
    }, [])

    const LoadReplacements = async () => {
        let a = await FetchReplacements() as Replaces;
        if (a) { setReplacements(a); }
    }

    const StatChange = (key: keyof ChampionStats, t?: boolean) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value === "" ? 0 : parseFloat(event.target.value);
        if (!isNaN(value)) {
            if (t) { value = Math.max(1, Math.min(18, Math.floor(value))); }
            onStatChange(key, value, t);
        }
    }

    const LevelKeydown = (t: boolean) => (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.ctrlKey && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) {
            return;
        }

        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

        if (allowedKeys.includes(event.key)) {
            return; // Permitir Backspace, Delete, Arrow keys e Tab
        }

        const currentValue = event.currentTarget.value;
        const newValue = currentValue + event.key;

        if (t) {
            if (!/^\d+$/.test(event.key) || (newValue.length > 2) || parseInt(newValue, 10) > 18 || parseInt(newValue, 10) < 1) {
                event.preventDefault();
            }
        } else {
            if (!/^\d$/.test(event.key)) {
                event.preventDefault();
            }
        }
    };

    return (
        <div className="px-12 flex flex-col gap-1 bg-slate-900 pb-3">
            {replacements && replacements.map((x, i) => {
                let v = x.name + i;
                let t = x.key == "level";
                let w = t ? 18 : championStats[x.key as keyof ChampionStats];
                return (
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
                                onKeyDown={LevelKeydown(t)}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                className="focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm rounded bg-slate-800 h-7 text-center text-zinc-300 w-16"
                                id={v}
                                placeholder={w.toString()}
                                onChange={StatChange(x.key as keyof ChampionStats, t)}
                            />
                        </label>
                    </div>
                )
            })}
        </div>
    )
}