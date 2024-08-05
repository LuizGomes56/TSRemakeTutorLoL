import { champion } from "../constants";
import { DataProps, Ply } from "../interfaces";

const Scores = ({ x }: { x: Ply[] }) => (
    x.map((p, i) => {
        let c = p.champion;
        let s = p.scores;
        return (
            <div key={c.name + i} className="text-zinc-300 sm:justify-between odd:bg-stone-900 even:bg-[#242427] even:border-b even:border-b-[#525252] even:border-t even:border-t-[#525252] grid grid-cols-2 gap-2 p-2">
                <span className="flex items-center">
                    <img src={champion(c.id)} alt={c.name} className="h-8 w-8" />
                    <span className="min-w-0 mx-1.5 hidden sm:flex flex-col justify-between h-[26px]">
                        <p title={p.summonerName} className="truncate text-xs text-zinc-300 leading-none">{p.summonerName}</p>
                        <p className="truncate text-[10px] text-zinc-400 leading-none">{p.championName}</p>
                    </span>
                </span>
                <span className="w-fit xl:place-self-center xl:min-w-16 justify-between flex items-center gap-1 leading-5 lg:text-sm text-sm text-zinc-300">
                    <p>{s.kills}</p>
                    <p>/</p>
                    <p>{s.deaths}</p>
                    <p>/</p>
                    <p>{s.assists}</p>
                </span>
            </div>
        )
    })
)

export default function Scoreboard({ game }: { game: DataProps }) {
    let a = game.allPlayers;
    let b = game.activePlayer;
    let e = a.filter(p => p.team !== b.team);
    let t = a.filter(p => p.team === b.team);
    return (
        <>
            <div className="grid grid-cols-2 bg-zinc-900 shade">
                {["Ally", "Enemy"].map((x, i) => (
                    <div key={x + i} className="h-12 flex items-center justify-center">
                        <span className="font-bold dropshadow text-zinc-300">{x} Team</span>
                    </div>
                ))}
                <div><Scores x={t} /></div>
                <div><Scores x={e} /></div>
            </div>
        </>
    )
}