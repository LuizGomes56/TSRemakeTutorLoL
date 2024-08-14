import { useEffect, useState } from "react"
import { BrowserData, CalculatorProps, ChampionStats, InitialDataState } from "./types-calculator"
import { centered, DisableDevTools, EndPoint, item, rune, spell } from "./constants";
import Break from "./components/break";
import Sources from "./components/tables/sources";
import Tool from "./components/tables/tool";
import Selector from "./components/selector";
import Loading from "./components/loading";
import DropdownChampions from "./components/dropdown/calculator/champions";
import DropdownItems from "./components/dropdown/calculator/items";
import DropdownRunes from "./components/dropdown/calculator/runes";
import Replacements from "./replacements";
import "./calculator.css";

const FetchGame = async (data: BrowserData, item: string, rec: boolean): Promise<CalculatorProps | null> => {
    const T1 = new Date();
    var o = { data, item, rec };
    try {
        let x = await fetch(EndPoint + "/api/game/calculator", {
            method: "POST",
            body: JSON.stringify(o),
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as { data: CalculatorProps, message?: string };
        const T2 = new Date();
        const TIME = (T2.getTime() - T1.getTime()) / 1000;
        console.log(TIME);
        if (y.data) { return y.data as CalculatorProps; }
        else { throw new Error(y.message) }
    }
    catch (e) { console.log(e); }
    return null;
}

export default function Calculator() {
    let [data, setData] = useState<BrowserData>(InitialDataState);
    let [game, setGame] = useState<CalculatorProps | null>(null);
    let [selectedItem, setSelectedItem] = useState<string>("4403");
    let [checked, setChecked] = useState<boolean[]>([]);
    let [recommend, setRecommend] = useState<boolean>(false);
    let [statbased, setStatbased] = useState<boolean>(true);

    let [dropChampion, setDropChampion] = useState<boolean>(true);
    let [dropItems, setDropItems] = useState<boolean>(true);
    let [dropRunes, setDropRunes] = useState<boolean>(true);

    // DisableDevTools();

    useEffect(() => {
        document.body.classList.add("darkblue");
    }, [])

    useEffect(() => {
        if (window.localStorage.calculator) { setData(JSON.parse(window.localStorage.calculator)); }
    }, [])

    useEffect(() => {
        window.localStorage.calculator = JSON.stringify(data);
        LoadData(data, selectedItem, recommend);
    }, [data, selectedItem, recommend, statbased]);

    const LoadData = async (data: BrowserData, item: string, rec: boolean) => {
        let a = await FetchGame(data, item, rec);
        if (a) {
            setGame(a);
            setChecked(prevChecked => !prevChecked.length ? new Array(a.allPlayers.filter(p => p.team !== a.activePlayer.team).length).fill(false) : prevChecked);
        }
    }

    const ToggleRecommend = () => recommend ? setRecommend(false) : setRecommend(true);

    const StatbasedChange = () => {
        let n = !statbased;
        setStatbased(n);
        setData(prevData => ({
            ...prevData,
            statbased: n,
        }));
    };

    const ChampionSelect = (championId: string, championName: string) => {
        setData(prevData => ({
            ...prevData,
            activePlayer: {
                ...prevData.activePlayer,
                championId: championId,
                championName: championName
            }
        }));
    }

    const ItemSelect = (itemId: string) => {
        setData(prevData => {
            if (prevData.activePlayer.items.includes(itemId)) { return prevData; }
            return {
                ...prevData,
                activePlayer: {
                    ...prevData.activePlayer,
                    items: [...prevData.activePlayer.items, itemId]
                }
            };
        });
    };

    const RuneSelect = (runeId: string) => {
        setData(prevData => {
            if (prevData.activePlayer.runes.includes(runeId)) { return prevData; }
            return {
                ...prevData,
                activePlayer: {
                    ...prevData.activePlayer,
                    runes: [...prevData.activePlayer.runes, runeId]
                }
            };
        });
    };

    const ItemRemove = (itemId: string) => {
        setData(prevData => ({
            ...prevData,
            activePlayer: {
                ...prevData.activePlayer,
                items: prevData.activePlayer.items.filter(item => item !== itemId)
            }
        }));
    };

    const RuneRemove = (runeId: string) => {
        setData(prevData => ({
            ...prevData,
            activePlayer: {
                ...prevData.activePlayer,
                runes: prevData.activePlayer.runes.filter(rune => rune !== runeId)
            }
        }));
    };

    const StatInput = (key: keyof ChampionStats, value: number, level?: boolean) => {
        if (level) {
            setData(prevData => ({
                ...prevData,
                activePlayer: {
                    ...prevData.activePlayer,
                    level: value,
                }
            }));
        }
        setData(prevData => ({
            ...prevData,
            activePlayer: {
                ...prevData.activePlayer,
                championStats: {
                    ...prevData.activePlayer.championStats,
                    [key]: value
                }
            }
        }));
    }

    return (
        <div className="container mx-auto bg-slate-950 flex flex-col lg:flex-row lg:justify-center">
            <div className="flex flex-col bg-slate-900 mb-4">
                <div className="relative flex mb-3">
                    <img src={centered(data.activePlayer.championId + "_0")} className="clip h-32" alt="" />
                    <h2 className="font-bold font-inter text-sky-200 text-shade absolute left-6 bottom-2 leading-none">
                        {data.activePlayer.championName}
                    </h2>
                </div>
                <div className="px-12 flex flex-col gap-1 my-1 relative">
                    <label className="mb-3 cursor-pointer xl:w-60 flex items-center justify-center bg-slate-800 rounded h-9 border border-slate-700">
                        <p className="dropshadow text-sky-300 text-sm font-inter">Stats based on items {statbased ? <span className="text-emerald-300 dropshadow px-2">YES</span> : <span className="text-red-300 dropshadow px-2">NO</span>}</p>
                        <input
                            onChange={StatbasedChange}
                            type="checkbox"
                            checked={statbased}
                            className="absolute opacity-0"
                        />
                    </label>
                    {Object.keys(data.activePlayer.abilities).sort((a, b) => {
                        let w = ["Q", "W", "E", "R"];
                        return w.indexOf(a) - w.indexOf(b);
                    }).map((t, i) => {
                        let c = data.activePlayer.abilities;
                        let v = c[t as keyof typeof c];
                        const AbilityLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                            let value = parseInt(event.target.value);
                            if (t === "R") { if (value < 0 || value > 3) { return; } }
                            else { if (value < 0 || value > 5) { return; } }
                            if (!isNaN(value)) {
                                setData(prevData => ({
                                    ...prevData,
                                    activePlayer: {
                                        ...prevData.activePlayer,
                                        abilities: {
                                            ...prevData.activePlayer.abilities,
                                            [t]: {
                                                ...prevData.activePlayer.abilities[t as keyof typeof c],
                                                abilityLevel: value
                                            }
                                        }
                                    }
                                }));
                            }
                        };
                        return (
                            <label key={t + i} className="flex gap-2 items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <div className="relative flex items-center justify-center">
                                        <img className="shade h-6 rounded" src={spell(data.activePlayer.championId + t)} alt="" />
                                        <h2 className="font-bold font-inter text-xs text-slate-200 text-shade absolute leading-none">{t}</h2>
                                    </div>
                                    <p className="dropshadow text-sky-300 text-sm font-inter">Level</p>
                                </span>
                                <input
                                    onKeyDown={(e) => {
                                        if (t === "R") { if (!["0", "1", "2", "3", "Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); } }
                                        else { if (!["0", "1", "2", "3", "4", "5", "Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); } }
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="w-16 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm rounded bg-slate-700 h-7 text-center text-zinc-200"
                                    placeholder={v.abilityLevel.toString()}
                                    onChange={AbilityLevelChange}
                                />
                            </label>
                        )
                    })}
                </div>
                <Replacements championStats={data.activePlayer.championStats} onStatChange={StatInput} />
            </div>
            <div className="flex flex-col w-full items-center p-4 max-w-4xl">
                <div className="flex flex-col lg:flex-row gap-4 bg-slate-950 w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <span onClick={() => setDropChampion(prev => prev ? false : true)} className="cursor-pointer flex justify-between items-center gap-2 rounded px-4 py-2 hover:bg-slate-800 transition-all duration-200">
                            <h2 className="font-bold font-inter text-sky-300">Champions</h2>
                            <img className="h-5" src="/chevdown.svg" alt="" />
                        </span>
                        <DropdownChampions visible={dropChampion} onChampionSelect={ChampionSelect} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <span onClick={() => setDropItems(prev => prev ? false : true)} className="cursor-pointer flex justify-between items-center gap-2 rounded px-4 py-2 hover:bg-slate-800 transition-all duration-200">
                            <h2 className="font-bold font-inter text-sky-300">Items</h2>
                            <img className="h-5" src="/chevdown.svg" alt="" />
                        </span>
                        <DropdownItems visible={dropItems} onItemSelect={ItemSelect} />
                        {data.activePlayer.items.length > 0 && <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded border border-slate-700">
                            {data.activePlayer.items.map((t, i) => (
                                <img onClick={() => ItemRemove(t)} key={t + i} className="h-8 rounded cursor-pointer outline-none hover:outline-2 hover:outline-sky-500 hover:outline-offset-2" src={item(t)} alt="" />
                            ))}
                        </div>}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <span onClick={() => setDropRunes(prev => prev ? false : true)} className="cursor-pointer flex justify-between items-center gap-2 rounded px-4 py-2 hover:bg-slate-800 transition-all duration-200">
                            <h2 className="font-bold font-inter text-sky-300">Runes</h2>
                            <img className="h-5" src="/chevdown.svg" alt="" />
                        </span>
                        <DropdownRunes visible={dropRunes} onRuneSelect={RuneSelect} />
                        {data.activePlayer.runes.length > 0 && <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded border border-slate-700">
                            {data.activePlayer.runes.map((t, i) => (
                                <img key={t + i} onClick={() => RuneRemove(t)} className="h-8 rounded cursor-pointer outline-none hover:outline-2 hover:outline-sky-500 hover:outline-offset-2" src={rune(t)} alt="" />
                            ))}
                        </div>}
                    </div>
                </div>
                <Break />
                {game ? (
                    <div className="flex flex-col w-full">
                        {(() => {
                            let { relevant, champion, tool } = game.activePlayer;
                            let { abilities, items, runes, spell } = relevant;
                            return (
                                <>
                                    <Sources
                                        abilities={abilities}
                                        champion={champion}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        enemies={game.allPlayers}
                                        checked={checked}
                                    />
                                    <Break />
                                    <Tool
                                        tool={tool}
                                        abilities={abilities}
                                        champion={champion}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        enemies={game.allPlayers}
                                        map={game.mapNumber.toString()}
                                        onItemClick={setSelectedItem}
                                        onRecommendClick={ToggleRecommend}
                                        checked={checked}
                                        recommend={recommend}
                                    />
                                    <Break />
                                    <Selector
                                        abilities={abilities}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        champion={champion}
                                        enemies={game.allPlayers}
                                        checked={checked}
                                    />
                                </>
                            );
                        })()}
                    </div>
                ) : <Loading />}
            </div>
        </div>
    )
}