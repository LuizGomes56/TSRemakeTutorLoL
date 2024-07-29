import { useState, useEffect } from "react";
import { allStats, EndPoint, stat } from "../constants";
import { ItemProps } from "../interfaces";
import { item } from "../constants";

const FetchItems = async (): Promise<ItemProps | void> => {
    try {
        let response = await fetch(EndPoint + "/api/lol/all/items", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default function Dropdown({ map }: { map: string }) {
    var [object, setObject] = useState<ItemProps | null>(null);
    var [text, setText] = useState<string>("");

    useEffect(() => {
        LoadData();
    }, []);

    const LoadData = async () => {
        let items = await FetchItems() as ItemProps;
        setObject(items);
    }

    const InputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    const Cells = ({ x, t }: { x: ItemProps, t: string }) => {
        let y = x.data;

        const LetterFinder = (n: string, q: string): Boolean => {
            let k = 0;
            for (let i = 0; i < n.length; i++) {
                if (n[i] === q[k]) { k++; }
                if (k === q.length) { return true; }
            }
            return false;
        };

        return (
            <div className="w-full bg-zinc-900 overflow-y-auto rounded">
                {Object.keys(y).filter(k => {
                    let z = y[k];
                    return z.maps[map] && z.gold.purchasable && LetterFinder(z.name.toLowerCase(), t.toLowerCase());
                }).map(c => {
                    let a = y[c];
                    return (
                        <div key={c} className="flex items-center gap-2 p-[6px] hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
                            <img className="h-5" src={item(c)} alt={c} />
                            <p className="text-sm text-neutral-300">{a.name}</p>
                        </div>
                    )
                })}
            </div>
        );
    }

    const Close = () => {
        return (
            <div className="absolute -top-3 -right-3 bg-stone-950 rounded-full">
                <img className="w-8 h-8" src="public/close.svg" alt="X" />
            </div>
        )
    }

    const Filters = () => {
        return (
            <div className="flex flex-col items-center bg-zinc-900 rounded">
                {allStats.map(s => (
                    <div className="p-2 hover:bg-slate-700 cursor-pointer transition-all duration-200">
                        <img className="min-w-4 max-w-4" src={stat(s)} alt="?" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 z-50 bg-neutral-950 rounded-lg fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-80">
            <Close />
            <div className="flex items-center relative">
                <input
                    type="text"
                    placeholder="Search for an item"
                    value={text}
                    onInput={InputEvent}
                    className="h-12 placeholder:text-neutral-300 rounded pl-12 w-full text-neutral-300 bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-800"
                />
                <img className="h-5 absolute left-4" src="public/search.svg" alt="Search" />
            </div>
            {object?.data &&
                <div className="mt-4 flex gap-2 max-h-[320px]">
                    <Cells x={object} t={text} />
                    <Filters />
                </div>}
        </div>
    );
}

// fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2