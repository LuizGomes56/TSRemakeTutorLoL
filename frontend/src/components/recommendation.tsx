import { item } from "../constants"

export default function Recommendation() {
    return (
        <div className="flex bg-neutral-900 p-3">
            <div className="h-fit grid grid-cols-2 gap-3">
                {["Suggestion", "Increase"].map(x => (<span className="flex justify-center gap-2 items-center text-white font-bold text-lg pb-2 border-b border-b-zinc-600">
                    <img className="h-8" src={`/${x.toLowerCase()}.png`} alt="Inc" />
                    <h2 className="text-white font-bold">{x}</h2>
                </span>))}
                {["4403", "3135", "4645"].map(x => (
                    <>
                        <div className="flex items-center gap-2">
                            <img className="h-8 w-8 rounded" src={item(x)} alt="Item" />
                            <p className="text-sm text-white front-bold dropshadow">Shadowflame</p>
                        </div>
                        {1502 > 0 ? <p className="text-center text-green-400 content-center dropshadow">1502</p> : <p className="text-red-500">-1502</p>}
                    </>
                ))}
            </div>
        </div>
    )
}