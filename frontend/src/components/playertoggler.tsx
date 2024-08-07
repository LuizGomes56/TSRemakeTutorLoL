import { champion } from "../constants";
import { Ply } from "../interfaces";

const PlayerToggler = ({ players, toggleChecked }: { players: Ply[], toggleChecked: (index: number) => void }) => {
    return (
        <div className="flex gap-2 bg-zinc-900 p-2 shade justify-between">
            <span className="content-center text-zinc-300 mx-2 dropshadow font-bold">
                Click to hide a player
            </span>
            <div className="flex items-center gap-1">
                {players.map((p, i) => (
                    <label
                        key={p.championName + i}
                        htmlFor={p.championName + i}
                        className="has-[:checked]:bg-rose-900 rounded transition-all duration-200 flex items-center justify-center p-0.5 hover:bg-zinc-500 bg-zinc-800 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            name="filter"
                            id={p.championName + i}
                            className="appearance-none hidden"
                            onChange={() => toggleChecked(i)}
                        />
                        <img className="h-8 rounded" src={champion(p.champion.id)} alt={p.championName} />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PlayerToggler;