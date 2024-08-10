import { useState } from "react";
import { centered } from "../constants";
import { DataProps } from "../interfaces";

export default function Card({ game }: { game: DataProps }) {
    let a = game.activePlayer;
    let c = a.champion;
    let t = game.gameData.gameTime;
    let m = Math.round(t / 60);
    let s = Math.floor(t % 60);

    let [imageSrc, setImageSrc] = useState(centered(`${c.id}_${a.skin}`));

    const handleImageError = () => setImageSrc(centered(`${c.id}_0`));

    return (
        <>
            <div className="flex gap-5 flex-col">
                <div className="bg-zinc-900 shade">
                    <img
                        className="clip h-24 sm:h-40 md:h-48 lg:h-64 xl:h-32"
                        src={imageSrc}
                        alt={c.name}
                        onError={handleImageError}
                    />
                    <span className="flex font-bold items-center justify-between text-zinc-300 p-4">
                        <p>{a.summonerName} - {a.championName}</p>
                        <p>{m}m {s}s</p>
                    </span>
                </div>
            </div>
        </>
    );
}
