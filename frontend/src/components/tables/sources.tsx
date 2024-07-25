import { Damage, DataProps } from "../../interfaces"
import { EndPoint, Style } from "../../constants";
import { useState } from "react";

const spell = (id: string) => `${EndPoint}/img/spell/${id}.png`;
const item = (id: string) => `${EndPoint}/img/item/${id}.png`;
const rune = (id: string) => `${EndPoint}/img/rune/${id}.png`;
const champion = (id: string) => `${EndPoint}/img/champion/${id}.png`;

type Relevant = DataProps["activePlayer"]["relevant"];

type Property = {
    abilities: Relevant["abilities"];
    items: Relevant["items"];
    runes: Relevant["runes"];
    spells: Relevant["spell"];
    champion: DataProps["activePlayer"]["champion"];
    enemies: DataProps["allPlayers"];
}

type Tip = {
    s: string;
    n?: string;
    d?: string;
} | null;

const VoidCells = () => (
    <th>
        <p>&zwnj;</p>
    </th>
)

const ChampionCells = ({ src, alt }: { src: string, alt: string }) => (
    <td>
        <img src={src} alt={alt}></img>
    </td>
)

const ImageCells = ({ src, alt, letter, onMouseOver, onMouseOut }: { src: string, alt: string, letter?: string, onMouseOver?: () => void, onMouseOut?: () => void }) => (
    <th onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        <span>
            <img src={src} alt={alt}></img>
            {letter && (
                <h2>
                    {letter.length > 1 ? (
                        <>
                            {letter.charAt(0)}
                            <sub>{letter.charAt(1)}</sub>
                        </>
                    ) : letter}
                </h2>
            )}

        </span>
    </th>
);

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

const Tooltip = ({ x }: { x: Tip }) => {
    return x ? (
        <div className="absolute bg-gray-700 text-white p-2 rounded shadow-md">
            <img src={x.s} alt={x.n} className="h-12 w-12" />
            <div className="ml-2">
                <h3 className="text-lg font-bold">{x.n}</h3>
                <p>{x.d}</p>
            </div>
        </div>
    ) : null;
};

export default function Sources(t: Property) {
    const [tip, setTip] = useState<Tip>(null);

    const MouseOver = (s: string, n?: string, d?: string) => () => {
        setTip({ s, n, d });
    };

    const MouseOut = () => setTip(null);

    return (
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
                            let d = !l ? x[0] == "P" ? c.passive.description : c.spells[a.indexOf(x[0])].description : undefined;
                            let n = !l ? x[0] == "P" ? c.passive.name : c.spells[a.indexOf(x[0])].name : undefined;
                            return <ImageCells
                                src={s}
                                alt={c.name}
                                letter={!l ? x : undefined}
                                onMouseOver={MouseOver(s, n, d)}
                                onMouseOut={MouseOut}
                            />
                        })}
                        {t.items.map(x => (
                            <ImageCells src={item(x)} alt={x} />
                        ))}
                        {t.runes.map(x => (
                            <ImageCells src={rune(x)} alt={x} />
                        ))}
                        {t.spells.map(x => (
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