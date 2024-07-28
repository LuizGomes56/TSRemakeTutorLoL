import { Damage, PropertyProps, Tip, ToolInfo } from "../../interfaces"
import { Style, spell, item, rune, champion, symbol } from "../../constants";
import { useState } from "react";
import Tooltip from "../tooltip";
import ImageCells from "./cells/image";
import VoidCells from "./cells/void";
import ChampionCells from "./cells/champion";

type Property = PropertyProps & {
    tool: ToolInfo;
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
                                <p className="text-slate-400 text-xs leading-3">
                                    {y.max ? `${Math.round(y.min)} - ${Math.round(y.max)} ` : Math.round(y.min)}
                                </p>
                            </>
                            :
                            <>
                                <p className={`${Style.damages[d.type as keyof typeof Style.damages]} text - sm`}>
                                    {Math.round(d.min)}
                                </p>
                                <p className="text-slate-400 text-xs leading-3">
                                    {Math.round(y.min)}
                                </p>
                            </>
                        }
                    </span>
                </td>
            );
        })}
    </>
);

const Suggestion = ({ x }: { x: ToolInfo }) => {
    return (
        <div className="bg-neutral-900 text-white p-3">
            <div className="border-b border-b-zinc-600 mb-2 pb-2 flex justify-between items-center gap-6 min-w-48 w-full">
                <span className="flex items-center gap-2">
                    <img className="h-8 rounded w-8" src={item(x.id)} alt="Item" />
                    <h3 className="text-white front-bold">{x.name}</h3>
                </span>
                <span className="flex items-center gap-1">
                    <img className="h-4 w-4" src={symbol("gold")} alt="Gold" />
                    <p className="text-yellow-300">{x.gold}</p>
                </span>
            </div>
            {x.mod && Object.keys(x.mod).map((y, i) => (
                <div className="flex items-center gap-2" key={i}>
                    <img className="h-4" src={symbol(y)} alt="Stat" />
                    <span className="text-sm text-neutral-300">{`${x.mod![y as keyof typeof x.mod]} ${Object.keys(x.raw)[i]}`}</span>
                </div>
            ))}
        </div>
    );
};

export default function Tool(t: Property) {
    const [tip, setTip] = useState<Tip>(null);

    const MouseOver = (s: string, n?: string, d?: string, r?: number[]) => () => {
        setTip({ s, n, d, r });
    };

    const MouseOut = () => setTip(null);

    return (
        <>
            {<Suggestion x={t.tool} />}
            <div className="overflow-auto">
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
                                let d = !l ? h ? c.passive.description : c.spells[a.indexOf(x[0])].description : undefined;
                                let n = !l ? h ? c.passive.name : c.spells[a.indexOf(x[0])].name : undefined;
                                let r = !l ? h ? [] : c.spells[a.indexOf(x[0])].cooldown : undefined;
                                return <ImageCells
                                    src={s}
                                    alt={c.name}
                                    letter={!l ? x : undefined}
                                    onMouseOver={d && n ? MouseOver(s, n, d, r) : undefined}
                                    onMouseOut={d && n ? MouseOut : undefined}
                                />
                            })}
                            {t.items.map(x => (
                                <ImageCells src={item(x)} alt={x} />
                            ))}
                            {t.runes.map(x => (
                                <ImageCells src={rune(x)} alt={x} />
                            ))}
                            {t.spell.map(x => (
                                <ImageCells src={rune(x)} alt={x} />
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {t.enemies.map(x => (
                            <tr>
                                <ChampionCells src={champion(x.champion.id)} alt={x.champion.name} />
                                <TextCells dif={x.tool?.dif?.abilities as Record<string, Damage>} max={x.tool?.max.abilities as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.items as Record<string, Damage>} max={x.tool?.max.items as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.runes as Record<string, Damage>} max={x.tool?.max.runes as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.spell as Record<string, Damage>} max={x.tool?.max.spell as Record<string, Damage>} />
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Tooltip x={tip} />
            </div>
        </>
    );
}