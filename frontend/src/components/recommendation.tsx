import { item } from "../constants"
import { CalculatorProps } from "../types-calculator";
import { Ply } from "../types-realtime"

export default function Recommendation({ x }: { x: Ply[] | CalculatorProps["allPlayers"] }) {
    let y = {} as Record<string, number>;
    x.forEach(e => {
        let z = e.tool?.rec;
        if (z) {
            for (let [k, v] of Object.entries(z)) {
                y[k] = y[k] || 0;
                y[k] += v / x.length;
            }
        }
    })

    let t = Object.entries(y).sort((a, b) => b[1] - a[1]);

    return (
        <div className="flex flex-col bg-neutral-900 p-3 gap-2 w-full darkblue:bg-[#10192b]">
            <span className="flex gap-2 items-center text-white font-bold pb-2 border-b border-b-zinc-600">
                <img className="h-8" src={`/suggestion.png`} alt="" />
                <p className="dropshadow">Recommendations</p>
            </span>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 lg:grid-cols-7">
                {t.map(([c, w], i) => (
                    <div key={c + i} className="flex items-center hover:bg-zinc-600 transition-all duration-300 w-full darkblue:bg-[#18253e] bg-zinc-800 p-1 rounded shade">
                        <span className="flex items-center justify-center relative">
                            <img src={item(c)} alt="" className="h-8 rounded" />
                            <p className="text-white text-shade font-mono">{i + 1}&deg;</p>
                        </span>
                        <span className="dropshadow flex-auto font-semibold flex items-center justify-center text-zinc-400">{Math.round(w)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}