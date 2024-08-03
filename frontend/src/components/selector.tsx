import { item, rune, spell } from "../constants";
import { RelevantProps, RequiredProps } from "../interfaces";

const SubText = {
    "min": "min",
    "max": "max"
}

type OptionsProps = {
    q: RelevantProps;
    m: "min" | "max";
    c: RequiredProps["champion"];
}

const AbilityOptions = ({ q, m, c }: OptionsProps) => {
    return (
        q[m].map(x => {
            let w = x[0];
            let l = ["A", "C"].includes(w);
            let s = l ? spell(w) : spell(c.id + w);
            let g = !l ? x : undefined;
            let j = g && q[m == "min" ? "max" : m].includes(g);
            return (
                <span className="relative flex items-center justify-center cursor-pointer">
                    <img src={s} alt={c.name} className="h-10 min-w-10 select-none shade"></img>
                    {g && (
                        <h2 className={`${g.length >= 1 && !j && "text-lg"} text-white absolute font-bold letter-shade`}>
                            {g.length > 1 ? (
                                <>
                                    {g.charAt(0)}
                                    <sub>
                                        {g.charAt(1)}
                                        {j && <span className="double-sub">{SubText[m]}</span>}
                                    </sub>
                                </>
                            ) : (
                                <>
                                    {j ?
                                        <>
                                            {g.charAt(0)}
                                            <sub>{SubText[m]}</sub>
                                        </> : g}
                                </>
                            )}
                        </h2>
                    )}
                </span>
            )
        })
    )
}

const KeyOptions = ({ q, m, c }: OptionsProps) => {
    return (
        q[m].map(x => {
            let g = q[m == "min" ? "max" : m].includes(x);
            return (
                <span className="relative flex items-center justify-center cursor-pointer">
                    <img src={Number(x) >= 8000 || isNaN(Number(x)) ? rune(x) : item(x)} alt={c.name} className="h-10 min-w-10 select-none shade"></img>
                    {g && <h2 className="text-white absolute font-bold letter-shade">{SubText[m]}</h2>}
                </span>
            )
        })
    )
}

export default function Selector(t: RequiredProps) {
    return (
        <>
            {
                <div className="flex flex-col gap-8 shade p-4 bg-zinc-900">
                    <div className="grid grid-cols-[max-content_1fr] gap-2 items-center">
                        <h2 className="text-zinc-300 place-self-center text-lg font-bold px-2 w-24 lg:mx-24 md:mx-10">Minimum</h2>
                        <div className="flex flex-wrap gap-2">
                            <AbilityOptions
                                q={t.abilities}
                                m="min"
                                c={t.champion}
                            />
                            <KeyOptions
                                q={t.items}
                                m="min"
                                c={t.champion}
                            />
                            <KeyOptions
                                q={t.runes}
                                m="min"
                                c={t.champion}
                            />
                            <KeyOptions
                                q={t.spell}
                                m="min"
                                c={t.champion}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-2 items-center">
                        <h2 className="text-zinc-300 place-self-center text-lg font-bold px-2 w-24 lg:mx-24 md:mx-10">Maximum</h2>
                        <div className="flex flex-wrap gap-2">
                            <AbilityOptions
                                q={t.abilities}
                                m="max"
                                c={t.champion}
                            />
                            <KeyOptions
                                q={t.items}
                                m="max"
                                c={t.champion}
                            />
                            <KeyOptions
                                q={t.runes}
                                m="max"
                                c={t.champion}
                            />
                            <KeyOptions
                                q={t.spell}
                                m="max"
                                c={t.champion}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}