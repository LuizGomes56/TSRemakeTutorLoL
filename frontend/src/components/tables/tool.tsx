import { Damage, PropertyProps, Tip, ToolInfo, EvalItemStats } from "../../interfaces"
import { Style, spell, item, rune, champion, stat, allStats, EndPoint } from "../../constants";
import { useState, useEffect, useRef } from "react";
import Tooltip from "../tooltip";
import ImageCells from "./cells/image";
import VoidCells from "./cells/void";
import ChampionCells from "./cells/champion";
import Searchbar from "../searchbar";
import Suggestion from "../suggestion";
import Searchbutton from "../searchbutton";

type Property = PropertyProps & {
    tool: ToolInfo;
    map: string;
}

const TextCells = ({ max, dif }: { max: Record<string, Damage>, dif: Record<string, Damage> }) => (
    <>
        {Object.keys(max).map(k => {
            let d = max[k];
            let y = dif[k];
            return (
                <td>
                    <span className="flex-col">
                        {d.max ?
                            <>
                                <p className={`${Style.damages[d.type as keyof typeof Style.damages]} text-sm`}>
                                    {`${Math.round(d.min)} - ${Math.round(d.max)} `}
                                </p>
                                {y.max && y.max > 0 && y.min > 0 ?
                                    <p className="text-slate-400 text-xs leading-3">
                                        {`${Math.round(y.min)} - ${Math.round(y.max)}`}
                                    </p> :
                                    y.min > 0 ? <p className="text-slate-400 text-xs leading-3">
                                        {Math.round(y.min)}
                                    </p> : null
                                }
                            </> :
                            <>
                                <p className={`${Style.damages[d.type as keyof typeof Style.damages]} text-sm`}>
                                    {Math.round(d.min)}
                                </p>
                                {y && y.min > 0 && <p className="text-slate-400 text-xs leading-3">
                                    {Math.round(y.min)}
                                </p>}
                            </>
                        }
                    </span>
                </td>
            );
        })}
    </>
);

const Cells = ({ x, t, m }: { x: Record<string, EvalItemStats>, t: string, m: string }) => {
    const LetterFinder = (n: string, q: string): Boolean => {
        let k = 0;
        for (let i = 0; i < n.length; i++) {
            if (n[i] === q[k]) { k++; }
            if (k === q.length) { return true; }
        }
        return false;
    };

    return (
        <div className="w-full bg-stone-800 overflow-y-auto rounded">
            {Object.keys(x).filter(k => {
                let z = x[k];
                return z.maps[m] && z.gold.purchasable && LetterFinder(z.name.toLowerCase(), t.toLowerCase());
            }).map(c => {
                let a = x[c];
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

const Filters = () => {
    return (
        <div className="flex flex-col items-center bg-stone-800 rounded">
            {allStats.map(s => (
                <div className="p-2 hover:bg-slate-700 cursor-pointer transition-all duration-200">
                    <img className="min-w-4 max-w-4" src={stat(s)} alt="?" />
                </div>
            ))}
        </div>
    );
}

const FetchItems = async (): Promise<Record<string, EvalItemStats> | void> => {
    try {
        console.log("Attempting")
        let response = await fetch(EndPoint + "/api/lol/all/items", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let data = await response.json() as Record<string, EvalItemStats>;
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default function Tool(t: Property) {
    var [tip, setTip] = useState<Tip>(null);
    var [search, setSearch] = useState<boolean>(false);
    var [stats, setStats] = useState<Record<string, EvalItemStats> | null>(null);
    var [text, setText] = useState<string>("");
    var dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        LoadStats();
    }, []);

    const LoadStats = async () => {
        let items = await FetchItems() as Record<string, EvalItemStats>;
        setStats(items);
    }

    const MouseOver = (s: string, n?: string, d?: string, r?: number[]) => () => {
        setTip({ s, n, d, r });
    };

    const MouseOut = () => setTip(null);

    const OpenSearch = () => setSearch(true);

    const InputEvent = (e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

    const ClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { setSearch(false); }
    };

    useEffect(() => {
        document.addEventListener("mousedown", ClickOutside);
        return () => {
            document.removeEventListener("mousedown", ClickOutside);
        };
    }, []);

    return (
        <>
            <Searchbutton click={OpenSearch} />
            <Suggestion x={t.tool} />

            {/* <div className="flex">
                {<Suggestion x={t.tool} />}
                {<Recommendation />}
            </div> */}

            {search && <div ref={dropdownRef} className="p-4 z-50 bg-stone-900 rounded-lg fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-80">
                <Searchbar event={InputEvent} text={text} />
                {stats &&
                    <div className="mt-4 flex gap-2 max-h-[320px]">
                        <Cells x={stats} t={text} m={t.map} />
                        <Filters />
                    </div>}
            </div>}

            <div className="overflow-auto shade">
                <table>
                    <thead>
                        <tr>
                            <VoidCells />
                            {t.abilities.min.map(x => {
                                let l = ["A", "C"].includes(x[0]);
                                let c = t.champion;
                                let s = l ? spell(x[0]) : spell(c.id + x[0]);
                                let a = ["Q", "W", "E", "R"];
                                let h = x[0] == "P";
                                let v = c.spells[a.indexOf(x[0])];
                                let d = !l ? h ? c.passive.description : v.description : undefined;
                                let n = !l ? h ? c.passive.name : v.name : undefined;
                                let r = !l ? h ? [] : v.cooldown : undefined;
                                return <ImageCells
                                    src={s}
                                    alt={c.name}
                                    letter={!l ? x : undefined}
                                    onMouseOver={d && n ? MouseOver(s, n, d, r) : undefined}
                                    onMouseOut={d && n ? MouseOut : undefined}
                                />
                            })}
                            {t.runes.map(x => (
                                <ImageCells src={rune(x)} alt={x} />
                            ))}
                            {t.spell.map(x => (
                                <ImageCells src={rune(x)} alt={x} />
                            ))}
                            {t.items.map(x => (
                                <ImageCells src={item(x)} alt={x} />
                            ))}
                            {t.tool.active && <ImageCells src={item(t.tool.id)} alt={t.tool.id} />}
                        </tr>
                    </thead>
                    <tbody>
                        {t.enemies.map(x => (
                            <tr>
                                <ChampionCells src={champion(x.champion.id)} alt={x.champion.name} />
                                <TextCells dif={x.tool?.dif?.abilities as Record<string, Damage>} max={x.tool?.max.abilities as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.runes as Record<string, Damage>} max={x.tool?.max.runes as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.spell as Record<string, Damage>} max={x.tool?.max.spell as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.items as Record<string, Damage>} max={x.tool?.max.items as Record<string, Damage>} />
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Tooltip x={tip} />
            </div>
        </>
    );
}