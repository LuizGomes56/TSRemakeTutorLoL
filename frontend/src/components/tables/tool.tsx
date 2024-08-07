import { Damage, PropertyProps, Tip, ToolInfo } from "../../interfaces"
import { Style, champion } from "../../constants";
import { useState, useEffect, useRef } from "react";
import Tooltip from "../tooltip";
import ChampionCells from "./cells/champion";
import Suggestion from "../suggestion";
import Searchbutton from "../searchbutton";
import Dropdown from "../dropdown";
import TableHeader from "./cells/thead";

type Property = PropertyProps & {
    tool: ToolInfo;
    map: string;
    onItemClick: (item: string) => void;
}

const TextCells = ({ max, dif, tool }: { max: Record<string, Damage>, dif: Record<string, Damage>, tool?: string }) => {
    let m = Object.keys(max);
    if (tool) {
        let w = m.indexOf(tool);
        if (w !== -1) {
            let z = m.splice(w, 1)[0];
            m.push(z);
        }
    }
    return (
        <>
            {m.map((k, i) => {
                let d = max[k];
                let y = dif[k];
                return (
                    <td key={i}>
                        <span className="flex-col">
                            {d.max ?
                                <>
                                    <p className={`${Style.damages[d.type as keyof typeof Style.damages]} text-sm`}>
                                        {`${Math.round(d.min)} - ${Math.round(d.max)} `}
                                    </p>
                                    {y ? y.max && y.max > 0 && y.min > 0 ?
                                        <p className="text-slate-400 text-xs leading-3">
                                            {`${Math.round(y.min)} - ${Math.round(y.max)}`}
                                        </p> :
                                        y.min > 0 ? <p className="text-slate-400 text-xs leading-3">
                                            {Math.round(y.min)}
                                        </p> : null
                                        : null}
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
    )
};

export default function Tool(t: Property) {
    var [tip, setTip] = useState<Tip | null>(null);
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
                        <TableHeader
                            abilities={t.abilities}
                            champion={t.champion}
                            runes={t.runes}
                            spell={t.spell}
                            items={t.items}
                            tool={t.tool}
                            onMouseOver={MouseOver}
                            onMouseOut={MouseOut}
                        />
                    </thead>
                    <tbody>
                        {t.enemies.map((x, i) => (
                            <tr key={i} className={t.checked[i] ? "hidden" : ""}>
                                <ChampionCells src={champion(x.champion.id)} alt={x.champion.name} />
                                <TextCells dif={x.tool?.dif?.abilities as Record<string, Damage>} max={x.tool?.max.abilities as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.runes as Record<string, Damage>} max={x.tool?.max.runes as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.spell as Record<string, Damage>} max={x.tool?.max.spell as Record<string, Damage>} />
                                <TextCells dif={x.tool?.dif?.items as Record<string, Damage>} max={x.tool?.max.items as Record<string, Damage>} tool={t.tool.id} />
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tip && <Tooltip x={tip} />}
            </div>
        </>
    );
}