import { champion } from "../constants";
import { DataProps, Ply } from "../interfaces";

const Scores = ({ x, y }: { x: Ply[], y?: (i: number) => void }) => (
    x.map((p, i) => {
        let c = p.champion;
        let s = p.scores;
        let d = c.name + i;
        let r = y ? `has-[:checked]:odd:bg-[#221418] has-[:checked]:even:bg-[#26121C] cursor-pointer odd:bg-[#0E1C1C] even:bg-[#032625]` : "odd:bg-stone-900 even:bg-[#242427]";
        return (
            <label
                htmlFor={d}
                key={d}
                className={`text-zinc-300 sm:justify-between even:border-b even:border-b-[#525252] even:border-t even:border-t-[#525252] grid grid-cols-2 gap-2 p-2 transition-all duration-200 ${r}`}
            >
                <input
                    type="checkbox"
                    id={d}
                    className="appearance-none hidden"
                    onChange={y ? () => y(i) : undefined}
                />
                <div className="flex items-center">
                    <img src={champion(c.id)} alt={c.name} className="h-8 w-8" />
                    <span className="min-w-0 mx-1.5 hidden sm:flex flex-col justify-between h-[26px]">
                        <p title={p.summonerName} className="truncate text-xs text-zinc-300 leading-none">{p.summonerName}</p>
                        <p className="truncate text-[10px] text-zinc-400 leading-none">{p.championName}</p>
                    </span>
                </div>
                <span className="w-fit xl:place-self-center xl:min-w-16 justify-between flex items-center gap-1 leading-5 lg:text-sm text-sm text-zinc-300">
                    <p>{s.kills}</p>
                    <p>/</p>
                    <p>{s.deaths}</p>
                    <p>/</p>
                    <p>{s.assists}</p>
                </span>
            </label>
        )
    })
);

export default function Scoreboard({ game, setChecked }: { game: DataProps, setChecked: React.Dispatch<React.SetStateAction<boolean[]>> }) {
    let a = game.allPlayers;
    let b = game.activePlayer;
    let e = a.filter(p => p.team !== b.team);
    let t = a.filter(p => p.team === b.team);

    const toggleChecked = (index: number) => {
        setChecked(prev => {
            let n = [...prev];
            n[index] = !n[index];
            return n;
        });
    };

    return (
        <>
            <div className="grid grid-cols-2 bg-zinc-900 shade">
                {["Allies", "Show / Hide Enemies"].map((x, i) => (
                    <div key={x + i} className="h-12 flex items-center justify-center">
                        <span className="font-bold dropshadow text-zinc-300">{x}</span>
                    </div>
                ))}
                <div><Scores x={t} /></div>
                <div><Scores x={e} y={toggleChecked} /></div>
            </div>
        </>
    )
}