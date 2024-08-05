import { centered } from "../constants";
import { DataProps } from "../interfaces";

export default function Card({ game }: { game: DataProps }) {
    let c = game.activePlayer.champion;
    return (
        <div className="bg-zinc-900 shade">
            <img className="h-28" src={centered(c.id)} alt={c.name} />
            <span className="flex items-center justify-between">
                <p>{game.activePlayer.summonerName}</p>
                <p>{game.gameData.gameTime}</p>
            </span>
        </div>
    )
}