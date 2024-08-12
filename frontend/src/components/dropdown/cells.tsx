import { item } from "../../constants";
import { EvalItemStats } from "../../types-realtime";

const Cells = ({ x, t, m, f, onItemClick }: { x: Record<string, EvalItemStats>, t: string, m: string, f: string[], onItemClick: (item: string) => void }) => {
    const LetterFinder = (n: string, q: string): Boolean => {
        let k = 0;
        for (let i = 0; i < n.length; i++) {
            if (n[i] === q[k]) { k++; }
            if (k === q.length) { return true; }
        }
        return false;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 content-start w-full overflow-y-auto gap-1 bg-zinc-900">
            {Object.keys(x).filter(k => {
                let z = x[k];
                const h = f.every(s => {
                    let g = Object.keys(z.stats.raw);
                    return s == "Armor Penetration" ? g.includes(s) || g.includes("Lethality") : g.includes(s);
                });
                return z.maps[m] && z.gold.purchasable && LetterFinder(z.name.toLowerCase(), t.toLowerCase()) && h;
            }).map((c, i) => {
                let a = x[c];
                return (
                    <div key={c + i} onClick={() => onItemClick(c)} className="cursor-pointer h-8 text-zinc-300 flex items-center gap-2 px-1.5 bg-zinc-900 hover:text-blue-300 hover:font-bold hover:bg-blue-950 transition-all duration-200">
                        <img className="h-5" src={item(c)} alt={c} />
                        <p className="select-none text-sm dropshadow">{a.name}</p>
                    </div>
                )
            })}
        </div>
    );
}

export default Cells