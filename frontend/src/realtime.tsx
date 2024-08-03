import { useState, useEffect } from 'react';
import { DataProps, RequestBody, Response } from './interfaces';
import Sources from './components/tables/sources';
import Tool from './components/tables/tool';
import { EndPoint } from './constants';
import './realtime.css';
import Summation from './components/tables/summation';
import Selector from './components/selector';

const FetchGame = async (item: string): Promise<DataProps | void> => {
    var o: RequestBody = { code: "969539", item };
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
    let [selectedItem, setSelectedItem] = useState<string>("4403");

    useEffect(() => {
        const delay = setInterval(() => {
            LoadData(selectedItem);
        }, 1000);
        return () => clearInterval(delay);
    }, [selectedItem]);

    const LoadData = async (item: string) => {
        let a = await FetchGame(item);
        console.log(a);
        if (a) { setGame(a) }
    }

    return (
        <div className="container mx-auto max-w-4xl">
            {game ? (
                <>
                    {(() => {
                        let { relevant, champion, tool } = game.activePlayer;
                        let { abilities, items, runes, spell } = relevant;
                        let enemies = game.allPlayers.filter(p => p.team !== game.activePlayer.team);

                        return (
                            <>
                                <Sources
                                    abilities={abilities}
                                    champion={champion}
                                    items={items}
                                    runes={runes}
                                    spell={spell}
                                    enemies={enemies}
                                />
                                <br />
                                <Tool
                                    tool={tool}
                                    abilities={abilities}
                                    champion={champion}
                                    items={items}
                                    runes={runes}
                                    spell={spell}
                                    enemies={enemies}
                                    map={game.gameData.mapNumber.toString()}
                                    onItemClick={setSelectedItem}
                                />
                                <br />
                                <Selector
                                    abilities={abilities}
                                    items={items}
                                    runes={runes}
                                    spell={spell}
                                    champion={champion}
                                />
                                <br />
                                <Summation
                                    enemies={enemies}
                                />
                            </>
                        );
                    })()}
                </>
            ) : ("Loading...")}
        </div>
    )
}