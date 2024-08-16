import { useEffect, useRef, useState } from "react"
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
import EnemyReplacements from "./components/enemyreplacements";
import { CoreStats } from "./types-realtime";

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

    let championRef = useRef<HTMLDivElement>(null);
    let itemRef = useRef<HTMLDivElement>(null);
    let runeRef = useRef<HTMLDivElement>(null);

    let enmChampionRefs = useRef<Array<HTMLDivElement | null>>(Array(5).fill(null));
    let enmItemRefs = useRef<Array<HTMLDivElement | null>>(Array(5).fill(null));

    let [enmStatbased, setEnmStatbased] = useState<boolean[]>(new Array<boolean>(5).fill(true));

    let [dropChampion, setDropChampion] = useState<boolean>(false);
    let [dropItems, setDropItems] = useState<boolean>(false);
    let [dropRunes, setDropRunes] = useState<boolean>(false);

    let [searchChampion, setSearchChampion] = useState("");
    let [searchItem, setSearchItem] = useState("");
    let [searchRune, setSearchRune] = useState("");

    let [enmDropChampions, setEnmDropChampions] = useState<boolean[]>(new Array(5).fill(false));
    let [enmDropItems, setEnmDropItems] = useState<boolean[]>(new Array(5).fill(false));

    let [enmSearchChampion, setEnmSearchChampion] = useState<string[]>(new Array<string>(5).fill(""));
    let [enmSearchItems, setEnmSearchItems] = useState<string[]>(new Array<string>(5).fill(""));

    DisableDevTools();

    const EnemyStatbasedChange = (i: number) => {
        setEnmStatbased(b => {
            const a = [...b];
            a[i] = !a[i];
            return a;
        });
        setData(p => {
            const u = [...p.allPlayers];
            u[i] = {
                ...u[i],
                statbased: !u[i].statbased,
            };
            return {
                ...p,
                allPlayers: u
            };
        });
    };

    const ActivePlayerCloseDropdown = (event: MouseEvent) => {
        if (championRef.current && !championRef.current.contains(event.target as Node)) { setDropChampion(false); }
        if (itemRef.current && !itemRef.current.contains(event.target as Node)) { setDropItems(false); }
        if (runeRef.current && !runeRef.current.contains(event.target as Node)) { setDropRunes(false); }
    };

    const CloseDropdowns = (e: MouseEvent) => {
        enmChampionRefs.current.forEach((r, i) => {
            if (r && !r.contains(e.target as Node)) {
                setEnmDropChampions(p => {
                    const u = [...p];
                    u[i] = false;
                    return u;
                });
            }
        });

        enmItemRefs.current.forEach((r, i) => {
            if (r && !r.contains(e.target as Node)) {
                setEnmDropItems(p => {
                    const u = [...p];
                    u[i] = false;
                    return u;
                });
            }
        });
    };

    useEffect(() => {
        document.addEventListener("mousedown", ActivePlayerCloseDropdown);
        return () => {
            document.removeEventListener("mousedown", ActivePlayerCloseDropdown);
        };
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", CloseDropdowns);
        return () => {
            document.removeEventListener("mousedown", CloseDropdowns);
        };
    }, []);

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

    const EnemyChampionSelect = (index: number, championId: string, championName: string) => {
        setData(prevData => ({
            ...prevData,
            allPlayers: prevData.allPlayers.map((player, i) =>
                i === index
                    ? {
                        ...player,
                        championName: championName,
                        championId: championId
                    }
                    : player
            )
        }));
    };

    const EnemyItemSelect = (index: number, itemId: string) => {
        setData(prevData => ({
            ...prevData,
            allPlayers: prevData.allPlayers.map((player, i) =>
                i === index
                    ? {
                        ...player,
                        items: player.items.includes(itemId) ? player.items : [...player.items, itemId]
                    }
                    : player
            )
        }));
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

    const EnemySearchChampionChange = (i: number, v: string) => {
        setEnmSearchChampion(p => {
            const u = [...p];
            u[i] = v;
            return u;
        });
    };

    const EnemySearchItemChange = (i: number, v: string) => {
        setEnmSearchItems(p => {
            const u = [...p];
            u[i] = v;
            return u;
        });
    };

    const EnemyDropChampionFocus = (i: number) => {
        setEnmDropChampions(p => {
            const u = [...p];
            u[i] = true;
            return u;
        });
    };

    const EnemyDropItemFocus = (i: number) => {
        setEnmDropItems(p => {
            const u = [...p];
            u[i] = true;
            return u;
        });
    };

    const EnemyItemRemove = (i: number, d: string) => {
        setData(p => {
            const u = [...p.allPlayers];
            u[i].items = u[i].items.filter(item => item !== d);
            return { ...p, allPlayers: u };
        });
    };

    return (
        <div className="bg-slate-950 flex flex-col xl:flex-row xl:justify-center">
            <div className="flex flex-col bg-slate-900 xl:max-h-screen xl:overflow-y-auto min-w-80">
                <div className="relative flex">
                    <img src={centered(data.activePlayer.championId + "_0")} className="clip h-32" alt="" />
                    <h2 className="font-bold font-inter text-sky-200 text-shade absolute left-6 bottom-2 leading-none">
                        {data.activePlayer.championName}
                    </h2>
                </div>
                <div className="flex flex-col gap-4 bg-slate-900 w-full p-4">
                    <div ref={championRef} className="flex flex-col gap-2 w-full">
                        <span className="relative flex items-center">
                            <input
                                type="text"
                                value={searchChampion}
                                onChange={(e) => setSearchChampion(e.target.value)}
                                placeholder="Search Champions"
                                className="w-full pl-10 pr-4 py-2 border border-slate-700 h-11 rounded bg-slate-800 text-sky-400 placeholder:text-sky-200 focus:outline-none placeholder:font-light placeholder:font-inter"
                                onFocus={() => setDropChampion(true)}
                            />
                            <img className="h-5 absolute left-3" src="/bluesearch.svg" alt="" />
                        </span>
                        <DropdownChampions visible={dropChampion} onChampionSelect={ChampionSelect} searchQuery={searchChampion} />
                    </div>
                    <div ref={itemRef} className="flex flex-col gap-2 w-full">
                        <span className="relative flex items-center">
                            <input
                                type="text"
                                value={searchItem}
                                onChange={(e) => setSearchItem(e.target.value)}
                                placeholder="Search Items"
                                className="w-full pl-10 pr-4 py-2 border border-slate-700 h-11 rounded bg-slate-800 text-sky-400 placeholder:text-sky-200 focus:outline-none placeholder:font-light placeholder:font-inter"
                                onFocus={() => setDropItems(true)}
                            />
                            <img className="h-5 absolute left-3" src="/bluesearch.svg" alt="" />
                        </span>
                        <DropdownItems visible={dropItems} onItemSelect={ItemSelect} searchQuery={searchItem} />
                        {data.activePlayer.items.length > 0 && <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded border border-slate-700">
                            {data.activePlayer.items.map((t, i) => (
                                <img onClick={() => ItemRemove(t)} key={t + i} className="h-8 rounded cursor-pointer outline-none hover:outline-2 hover:outline-sky-500 hover:outline-offset-2" src={item(t)} alt="" />
                            ))}
                        </div>}
                    </div>
                    <div ref={runeRef} className="flex flex-col gap-2 w-full">
                        <span className="relative flex items-center">
                            <input
                                type="text"
                                value={searchRune}
                                onChange={(e) => setSearchRune(e.target.value)}
                                placeholder="Search Runes"
                                className="w-full pl-10 pr-4 py-2 border border-slate-700 h-11 rounded bg-slate-800 text-sky-400 placeholder:text-sky-200 focus:outline-none placeholder:font-light placeholder:font-inter"
                                onFocus={() => setDropRunes(true)}
                            />
                            <img className="h-5 absolute left-3" src="/bluesearch.svg" alt="" />
                        </span>
                        <DropdownRunes visible={dropRunes} onRuneSelect={RuneSelect} searchQuery={searchRune} />
                        {data.activePlayer.runes.length > 0 && <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded border border-slate-700">
                            {data.activePlayer.runes.map((t, i) => (
                                <img key={t + i} onClick={() => RuneRemove(t)} className="h-8 rounded cursor-pointer outline-none hover:outline-2 hover:outline-sky-500 hover:outline-offset-2" src={rune(t)} alt="" />
                            ))}
                        </div>}
                    </div>
                    <label title="It will lock all stat inputs if enabled" className="relative pl-10 cursor-pointer flex items-center gap-1 bg-slate-800 rounded h-11 border border-slate-700">
                        <img className="absolute h-5 left-3" src="/stats.svg" alt="" />
                        <p className="font-light text-sky-200 font-inter">Stats based on items {statbased ? <span className="text-emerald-300 dropshadow px-1">ON</span> : <span className="text-red-300 dropshadow px-1">OFF</span>}</p>
                        <input
                            onChange={StatbasedChange}
                            type="checkbox"
                            checked={statbased}
                            className="absolute opacity-0"
                        />
                    </label>
                </div>
                <div className="px-12 flex flex-col gap-1 mb-1 relative">
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
                                        <img className="shade h-7 rounded" src={spell(data.activePlayer.championId + t)} alt="" />
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
                <Replacements championStats={game ? game.activePlayer.championStats : data.activePlayer.championStats} onStatChange={StatInput} inputDisabled={statbased} />
            </div>
            <div className="flex flex-col w-full items-center xl:p-5 my-5 xl:my-0 xl:max-w-4xl xl:overflow-y-auto xl:max-h-screen">
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
                <div
                    className="w-full p-3 hover:bg-blue-950 cursor-pointer hover:text-xl transition-all duration-200 bg-slate-800 text-sky-300 font-semibold text-lg text-center mt-5"
                    onClick={() => setData(InitialDataState)}>
                    Reset to default
                </div>
            </div>
            <div className="flex flex-col bg-slate-900 xl:overflow-y-auto xl:max-h-screen min-w-80">
                {game && game.allPlayers.map((x, i) => {
                    return (
                        <div key={x.champion.id + i}>
                            <div className="relative flex">
                                <img src={centered(game.allPlayers[game.allPlayers.indexOf(x)].champion.id + "_0")} className="clip h-32" alt="" />
                                <h2 className="font-bold font-inter text-sky-200 text-shade absolute left-6 bottom-2 leading-none">
                                    {game.allPlayers[game.allPlayers.indexOf(x)].champion.name}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-4 bg-slate-900 w-full p-4">
                                <div ref={el => enmChampionRefs.current[i] = el} className="flex flex-col gap-2 w-full">
                                    <span className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={enmSearchChampion[i]}
                                            onChange={(e) => EnemySearchChampionChange(i, e.target.value)}
                                            placeholder="Search Champions"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-700 h-11 rounded bg-slate-800 text-sky-400 placeholder:text-sky-200 focus:outline-none placeholder:font-light placeholder:font-inter"
                                            onFocus={() => EnemyDropChampionFocus(i)}
                                        />
                                        <img className="h-5 absolute left-3" src="/bluesearch.svg" alt="" />
                                    </span>
                                    <DropdownChampions visible={enmDropChampions[i]} onChampionSelect={(championId, championName) => EnemyChampionSelect(i, championId, championName)} searchQuery={enmSearchChampion[i]} />
                                </div>
                                <div ref={el => enmItemRefs.current[i] = el} className="flex flex-col gap-2 w-full">
                                    <span className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={enmSearchItems[i]}
                                            onChange={(e) => EnemySearchItemChange(i, e.target.value)}
                                            placeholder="Search Items"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-700 h-11 rounded bg-slate-800 text-sky-400 placeholder:text-sky-200 focus:outline-none placeholder:font-light placeholder:font-inter"
                                            onFocus={() => EnemyDropItemFocus(i)}
                                        />
                                        <img className="h-5 absolute left-3" src="/bluesearch.svg" alt="" />
                                    </span>
                                    <DropdownItems visible={enmDropItems[i]} onItemSelect={(itemId) => EnemyItemSelect(i, itemId)} searchQuery={enmSearchItems[i]} />
                                    {x.items.length > 0 && <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded border border-slate-700">
                                        {x.items.map((t, j) => (
                                            <img onClick={() => EnemyItemRemove(i, t)} key={t + j} className="h-8 rounded cursor-pointer outline-none hover:outline-2 hover:outline-sky-500 hover:outline-offset-2" src={item(t)} alt="" />
                                        ))}
                                    </div>}
                                </div>
                                <label title="It will lock all stat inputs if enabled" className="relative pl-10 cursor-pointer flex items-center gap-1 bg-slate-800 rounded h-11 border border-slate-700">
                                    <img className="absolute h-5 left-3" src="/stats.svg" alt="" />
                                    <p className="font-light text-sky-200 font-inter">Stats based on items {enmStatbased[i] ? <span className="text-emerald-300 dropshadow px-1">ON</span> : <span className="text-red-300 dropshadow px-1">OFF</span>}</p>
                                    <input
                                        onChange={() => EnemyStatbasedChange(i)}
                                        type="checkbox"
                                        checked={enmStatbased[i]}
                                        className="absolute opacity-0"
                                    />
                                </label>
                            </div>
                            <EnemyReplacements championStats={game.allPlayers[game.allPlayers.indexOf(x)].championStats as CoreStats} onStatChange={(StatInput)} inputDisabled={enmStatbased[i]} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}