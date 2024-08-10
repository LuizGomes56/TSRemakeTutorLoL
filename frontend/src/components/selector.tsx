import { useState } from "react";
import { item, rune, spell } from "../constants";
import { PropertyProps, RelevantProps, RequiredProps, Tag } from "../interfaces";
import Summation from "./tables/summation";

const SubText = {
    "min": "min",
    "max": "max"
}

type OptionsProps = {
    q: RelevantProps;
    m: "min" | "max";
    c: RequiredProps["champion"];
    e: (k: Tag) => void;
}

const Instances = ({ instance, e }: { instance: Tag[], e: (i: number) => void }) => {
    return (
        <>
            {
                instance.map((x, i) => (
                    <span key={x.id + i + x.text} onClick={() => e(i)} className="relative flex items-center justify-center cursor-pointer">
                        <img src={x.img} alt={x.id} className="h-9 min-w-9 rounded select-none shade"></img>
                        {x.text[0].length > 0 &&
                            <h2 className="select-none text-white absolute font-bold letter-shade">
                                {x.text[0]}
                                {x.text[1] && <sub>
                                    {x.text[1]}
                                    {x.text[2] && <span className="double-sub">{x.text[2]}</span>}
                                </sub>}
                            </h2>
                        }
                    </span>
                ))
            }
        </>
    )
}

const AbilityOptions = ({ q, m, c, e }: OptionsProps) => {
    return (
        q[m].map((x, i) => {
            let w = x[0];
            let l = ["A", "C"].includes(w);
            let s = l ? spell(w) : spell(c.id + w);
            let g = !l ? x : undefined;
            let j = g && q[m == "min" ? "max" : m].includes(g);
            return (
                <span key={x + i + m + g} onClick={() => e({ id: x, key: "abilities", img: s, mod: m, text: g ? g.length > 1 ? [g.charAt(0), g.charAt(1), j ? SubText[m] : ""] : j ? [g.charAt(0), SubText[m], ""] : [g, "", ""] : ["", "", ""] })} className="relative flex items-center justify-center cursor-pointer">
                    <img src={s} alt={c.name} className="h-9 min-w-9 rounded select-none shade"></img>
                    {g && (
                        <h2 className={`${g.length >= 1 && !j && "text-base"} select-none text-white absolute font-bold letter-shade`}>
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

const KeyOptions = ({ q, m, c, e }: OptionsProps) => {
    return (
        q[m].map((x, i) => {
            let g = q[m == "min" ? "max" : m].includes(x);
            let y = Number(x) >= 8000 || isNaN(Number(x));
            let s = y ? rune(x) : item(x);
            return (
                <span key={x + i + m + g} onClick={() => e({ id: x, key: Number(x) >= 8000 ? "runes" : isNaN(Number(x)) ? "spell" : "items", img: s, mod: m, text: [g ? SubText[m] : "", "", ""] })} className="relative flex items-center justify-center cursor-pointer">
                    <img src={s} alt={c.name} className="h-9 min-w-9 rounded select-none shade"></img>
                    {g && <h2 className="select-none text-white absolute font-bold text-sm letter-shade">{SubText[m]}</h2>}
                </span>
            )
        })
    )
}

type SectionProps = {
    h: string;
    m: "min" | "max";
    a: RelevantProps;
    i: RelevantProps;
    r: RelevantProps;
    s: RelevantProps;
    c: RequiredProps["champion"];
    e: (k: Tag) => void;
}

const Section = ({ h, m, a, i, r, s, c, e }: SectionProps) => (
    <>
        <h2 className="text-zinc-300 dropshadow place-self-center text-lg font-bold">{h}</h2>
        <div className="flex flex-wrap gap-2">
            <AbilityOptions q={a} m={m} c={c} e={e} />
            <KeyOptions q={i} m={m} c={c} e={e} />
            <KeyOptions q={r} m={m} c={c} e={e} />
            <KeyOptions q={s} m={m} c={c} e={e} />
        </div>
    </>
);

export default function Selector(t: PropertyProps) {
    let [instance, setInstance] = useState<Tag[]>([]);

    const Select = (e: Tag) => setInstance(prev => [...prev, e]);

    const Remove = (e: number) => setInstance(prev => prev.filter((_, i) => i !== e));

    return (
        <>
            {
                <div className="grid grid-cols-2 md:grid-cols-[1fr,1fr,auto] justify-center shade p-4 bg-zinc-900 gap-4 sm:gap-6 md:gap-8">
                    <div className="flex flex-col gap-4 flex-auto justify-self-center md:justify-self-auto">
                        <Section
                            h="Minimum"
                            m="min"
                            a={t.abilities}
                            i={t.items}
                            r={t.runes}
                            s={t.spell}
                            c={t.champion}
                            e={Select}
                        />
                        <Section
                            h="Maximum"
                            m="max"
                            a={t.abilities}
                            i={t.items}
                            r={t.runes}
                            s={t.spell}
                            c={t.champion}
                            e={Select}
                        />
                    </div>
                    <div className="flex flex-col gap-4 flex-auto justify-self-center md:justify-self-auto">
                        <h2 className="text-zinc-300 dropshadow place-self-center text-lg font-bold">Selected</h2>
                        <div className="flex gap-2 flex-wrap">
                            <Instances instance={instance} e={Remove} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                        <h2 className="text-zinc-300 dropshadow place-self-center text-lg font-bold">Summation</h2>
                        <Summation enemies={t.enemies} instance={instance} checked={t.checked} />
                    </div>
                </div>
            }
        </>
    )
}