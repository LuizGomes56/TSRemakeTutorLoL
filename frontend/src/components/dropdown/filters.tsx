import { allStats, stat } from "../../constants";

export default function Filters({ onFilter }: { onFilter: (stat: string) => void }) {
    return (
        <div className="flex flex-col items-center rounded gap-1 darkblue:bg-slate-900 bg-zinc-800">
            {allStats.map((s, i) => (
                <label key={s + i} htmlFor={s + i} className="darkblue:has-[:checked]:bg-slate-700 has-[:checked]:bg-zinc-700 transition-all duration-200 flex items-center justify-center h-8 w-8 darkblue:hover:bg-slate-600 hover:bg-slate-700 darkblue:bg-slate-800 bg-zinc-800 cursor-pointer">
                    <input type="checkbox" name="filter" id={s + i} className="appearance-none hidden" onChange={() => onFilter(s)} />
                    <img className="w-4" src={stat(s.replace(/\s+/g, ""))} alt="?" />
                </label>
            ))}
        </div>
    );
}