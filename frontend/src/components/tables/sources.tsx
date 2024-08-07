import { Damage, PropertyProps, Tip } from "../../interfaces"
import { Style, champion } from "../../constants";
import { useState } from "react";
import Tooltip from "../tooltip";
import ChampionCells from "./cells/champion";
import TableHeader from "./cells/thead";

const TextCells = ({ damage }: { damage: Record<string, Damage> }) => (
    <>
        {Object.keys(damage).map((k, i) => {
            let d = damage[k];
            return (
                <td key={k + i}>
                    <p className={`${Style.damages[d.type as keyof typeof Style.damages]} text-sm`}>
                        {d.max ? `${Math.round(d.min)} - ${Math.round(d.max)}` : Math.round(d.min)}</p>
                </td>
            );
        })}
    </>
);

export default function Sources(t: PropertyProps) {
    let [tip, setTip] = useState<Tip | null>(null);

    const MouseOver = (s: string, n?: string, d?: string, r?: number[]) => () => {
        setTip({ s, n, d, r });
    };

    const MouseOut = () => setTip(null);

    return (
        <div className="overflow-auto shade">
            <table>
                <thead>
                    <TableHeader
                        abilities={t.abilities}
                        champion={t.champion}
                        runes={t.runes}
                        spell={t.spell}
                        items={t.items}
                        onMouseOver={MouseOver}
                        onMouseOut={MouseOut}
                    />
                </thead>
                <tbody>
                    {t.enemies.map((x, i) => (
                        <tr key={i} className={t.checked[i] ? "hidden" : ""}>
                            <ChampionCells src={champion(x.champion.id)} alt={x.champion.name} />
                            <TextCells damage={x.damage.abilities as Record<string, Damage>} />
                            <TextCells damage={x.damage.runes as Record<string, Damage>} />
                            <TextCells damage={x.damage.spell as Record<string, Damage>} />
                            <TextCells damage={x.damage.items as Record<string, Damage>} />
                        </tr>
                    ))}
                </tbody>
            </table>
            {tip && <Tooltip x={tip} />}
        </div>
    );
}