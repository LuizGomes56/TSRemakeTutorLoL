import { useState, useEffect } from 'react';
import { DataProps, RequestBody, Response } from './interfaces';
import Sources from './components/tables/sources';
import Tool from './components/tables/tool';
import { EndPoint, RefreshTime } from './constants';
import './realtime.css';
import Selector from './components/selector';
import Scoreboard from './components/scoreboard';
import Loading from './components/loading';

const code = "401085" /* "969539" Futurely implement it from window/location/hash */;

const FetchGame = async (item: string): Promise<DataProps | void> => {
    var o: RequestBody = { code: code, item };
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
        LoadData(selectedItem);
        const interval = setInterval(() => {
            LoadData(selectedItem);
        }, RefreshTime);

        return () => clearInterval(interval);
    }, [selectedItem]);

    const LoadData = async (item: string) => {
        let a = await FetchGame(item);
        // console.log(a);
        if (a) { setGame(a); }
    }

    return (
        <>
            {game ? (
                <div className="container mx-auto xl:flex xl:gap-5">
                    <div className="mt-5 max-w-4xl lg:w-full lg:max-w-none xl:w-fit xl:max-w-4xl">
                        <Scoreboard game={game} />
                    </div>
                    <div className="flex flex-col max-w-4xl lg:w-full lg:max-w-none xl:w-auto xl:max-w-4xl">
                        {(() => {
                            let { relevant, champion, tool } = game.activePlayer;
                            let { abilities, items, runes, spell } = relevant;
                            let enemies = game.allPlayers.filter(p => p.team !== game.activePlayer.team);
                            return (
                                <>
                                    <div className="h-5 w-0 br" />
                                    <Sources
                                        abilities={abilities}
                                        champion={champion}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        enemies={enemies}
                                    />
                                    <div className="h-5 w-0" />
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
                                    <div className="h-5 w-0" />
                                    <Selector
                                        abilities={abilities}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        champion={champion}
                                        enemies={enemies}
                                    />
                                    <div className="h-5 w-0" />
                                </>
                            );
                        })()}
                    </div>
                </div>
            ) : <Loading />}
        </>
    )
}