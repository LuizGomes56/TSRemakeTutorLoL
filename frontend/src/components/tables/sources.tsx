import { Damage, PropertyProps, Tip } from "../../interfaces"
import { Style, spell, item, rune, champion } from "../../constants";
import { useState } from "react";
import Tooltip from "../tooltip";
import ImageCells from "./cells/image";
import VoidCells from "./cells/void";
import ChampionCells from "./cells/champion";

const TextCells = ({ damage }: { damage: Record<string, Damage> }) => (
    <>
        {Object.keys(damage).map(k => {
            let d = damage[k];
            return (
                <td>
                    <p className={Style.damages[d.type as keyof typeof Style.damages]}>
                        {d.max ? `${Math.round(d.min)} - ${Math.round(d.max)}` : Math.round(d.min)}</p>
                </td>
            );
        })}
    </>
);

export default function Sources(t: PropertyProps) {
    const [tip, setTip] = useState<Tip>(null);

    const MouseOver = (s: string, n?: string, d?: string, r?: number[]) => () => {
        setTip({ s, n, d, r });
    };

    const MouseOut = () => setTip(null);

    return (
        <div className="overflow-auto">
            <table>
                <thead>
                    <tr>
                        <VoidCells />
                        {t.abilities.min.map(x => {
                            let h = x[0] == "P";
                            let l = ["A", "C"].includes(x[0]);
                            let c = t.champion;
                            let s = l ? spell(x[0]) : spell(c.id + x[0]);
                            let a = ["Q", "W", "E", "R"];
                            let j = a.indexOf(x[0]);
                            let d = !l ? h ? c.passive.description : c.spells[j].description : undefined;
                            let n = !l ? h ? c.passive.name : c.spells[j].name : undefined;
                            let r = !l ? h ? [] : c.spells[j].cooldown : undefined;
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
                            <TextCells damage={x.damage.abilities as Record<string, Damage>} />
                            <TextCells damage={x.damage.items as Record<string, Damage>} />
                            <TextCells damage={x.damage.runes as Record<string, Damage>} />
                            <TextCells damage={x.damage.spell as Record<string, Damage>} />
                        </tr>
                    ))}
                </tbody>
            </table>
            <Tooltip x={tip} />
        </div>
    );
}