import { centered } from "../constants";
import { DataProps } from "../interfaces";
// import PlayerToggler from "./playertoggler";

export default function Card({ game, /*setChecked*/ }: { game: DataProps/*, setChecked: React.Dispatch<React.SetStateAction<boolean[]>> */ }) {
    let a = game.activePlayer;
    let c = a.champion;
    let t = game.gameData.gameTime;
    let m = Math.round(t / 60);
    let s = Math.round(t % 60);
    // let e = game.allPlayers.filter(t => t.team !== a.team);

    // const toggleChecked = (index: number) => {
    //     setChecked(prev => {
    //         let n = [...prev];
    //         n[index] = !n[index];
    //         return n;
    //     });
    // };

    return (
        <div className="flex gap-5 flex-col">
            <div className="bg-zinc-900 shade">
                <img className="clip h-24 sm:h-40 md:h-48 lg:h-64 xl:h-32" src={centered(`${c.id}_${a.skin}`)} alt={c.name} />
                <span className="flex font-bold items-center justify-between text-zinc-300 p-4">
                    <p>{a.summonerName} - {a.championName}</p>
                    <p>{m}m {s}s</p>
                </span>
            </div>
            {/* <PlayerToggler players={e} toggleChecked={toggleChecked} /> */}
        </div>
    );
}
