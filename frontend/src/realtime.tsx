import { useState, useEffect } from 'react';
import { DataProps, RequestBody, Response } from './interfaces';

const EndPoint: string = "http://localhost:3000";
const Images = {
    passive: (id: string) => `${EndPoint}/img/passive/${id}.png`,
    spell: (id: string) => `${EndPoint}/img/spell/${id}.png`,
    item: (id: string) => `${EndPoint}/img/item/${id}.png`,
    rune: (id: string) => `${EndPoint}/img/rune/${id}.png`,
    champion: (id: string) => `${EndPoint}/img/champion/${id}.png`
}

const o: RequestBody = { code: "401085", item: "4645" };

const FetchGame = async (): Promise<DataProps | void> => {
    let x = await fetch(EndPoint + "/api/game/last", {
        method: "POST",
        body: JSON.stringify(o),
        headers: { "Content-Type": "application/json" }
    });
    let y = await x.json() as Response;
    if (y) return JSON.parse(y.data.game) as DataProps;
}

export default function Page() {
    let [game, setGame] = useState<DataProps | null>(null);
    useEffect(() => {
        LoadData();
    }, [])

    const LoadData = async () => {
        let a = await FetchGame();
        console.log(a);
        if (a) { setGame(a) }
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {
                            game ? game.activePlayer.relevant.abilities.min.map((a, i) => {
                                let icon = ["A", "C"].includes(a.charAt(0));
                                return (
                                    <td className="relative flex justify-center items-center bg-black text-white p-4 text-xl" key={i}>
                                        <img src={Images.spell(game.activePlayer.champion.spells[0].id)} alt="Spell" />
                                        <span className="absolute font-medium text-xl">{`${a} and ${i}`}</span>
                                    </td>
                                )
                            }) : "Loading..."
                        }
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
            <div className="bg-slate-500">{game ? game.activePlayer.abilities.E.abilityLevel : "Operação Realizada"}</div>
        </>
    )
}