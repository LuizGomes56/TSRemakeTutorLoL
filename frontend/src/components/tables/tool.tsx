import { Damage, PropertyProps, Tip, ToolInfo } from "../../interfaces"
import { Style, spell, item, rune, champion } from "../../constants";
import { useState, useEffect, useRef } from "react";
import Tooltip from "../tooltip";
import ImageCells from "./cells/image";
import VoidCells from "./cells/void";
import ChampionCells from "./cells/champion";
import Suggestion from "../suggestion";
import Searchbutton from "../searchbutton";
import Dropdown from "../dropdown";

type Property = PropertyProps & {
    tool: ToolInfo;
    map: string;
    onItemClick: (item: string) => void;
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

export default function Tool(t: Property) {
    var [tip, setTip] = useState<Tip>(null);
    var [search, setSearch] = useState<boolean>(false);
    var dropdownRef = useRef<HTMLDivElement>(null);

    const MouseOver = (s: string, n?: string, d?: string, r?: number[]) => () => {
        setTip({ s, n, d, r });
    };

    const MouseOut = () => setTip(null);

    const OpenSearch = () => setSearch(true);

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

            {search && <Dropdown map={t.map} ref={dropdownRef} onItemClick={t.onItemClick} />}

            <div className="overflow-auto shade">
                <table>
                    <thead>
                        <tr>
                            <VoidCells />
                            {t.abilities.min.map(x => {
                                let w = x[0];
                                let l = ["A", "C"].includes(w);
                                let c = t.champion;
                                let s = l ? spell(w) : spell(c.id + w);
                                let a = ["Q", "W", "E", "R"];
                                let h = w == "P";
                                let v = c.spells[a.indexOf(w)];
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