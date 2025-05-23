import { ToolInfo } from "../types-realtime";
import { stat, item } from "../constants";

export default function Suggestion({ x }: { x: ToolInfo }) {
    return (
        <div className="bg-neutral-900 text-white p-3 darkblue:bg-[#10192b]">
            <div className="border-b border-b-zinc-600 mb-2 pb-2 flex justify-between items-center gap-6 min-w-48 w-full">
                <span className="flex items-center gap-2">
                    <img className="h-8 rounded w-8 shade" src={item(x.id)} alt="Item" />
                    <h3 className="text-white font-bold dropshadow">{x.name}</h3>
                </span>
                <span className="flex items-center gap-1">
                    <img className="h-4 w-4" src={stat("GoldPer10Seconds")} alt="Gold" />
                    <p className="text-yellow-300 dropshadow">{x.gold}</p>
                </span>
            </div>
            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-3 gap-2">
                {x.raw && Object.keys(x.raw).map((y, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <img className="h-4" src={stat(y.replace(/\s+/g, ""))} alt="Stat" />
                        <span className="text-sm dropshadow darkblue:text-blue-200 text-zinc-300">{`${x.raw![y as keyof typeof x.raw]} ${Object.keys(x.raw)[i]}`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};