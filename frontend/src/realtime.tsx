import { useState, useEffect } from 'react';
import { DataProps, RequestBody, Response } from './interfaces';
import Sources from './components/tables/sources';
import Tool from './components/tables/tool';
import { EndPoint, MaxRequests, RefreshTime } from './constants';
import './realtime.css';
import Selector from './components/selector';
import Scoreboard from './components/scoreboard';
import Loading from './components/loading';
import Card from './components/card';
import Awaiter from './components/awaiter';
import Break from './components/break';

const FetchGame = async (code: string, item: string): Promise<DataProps | null> => {
    var o: RequestBody = { code: code, item };
    try {
        let x = await fetch(EndPoint + "/api/game/last", {
            method: "POST",
            body: JSON.stringify(o),
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as Response;
        if (y.success) { return JSON.parse(y.data.game) as DataProps; }
        else { throw new Error(y.message) }
    }
    catch (e) { console.log(e); }
    return null;
}

export default function Page() {
    let [game, setGame] = useState<DataProps | null>(null);
    let [selectedItem, setSelectedItem] = useState<string>("4403");
    let [checked, setChecked] = useState<boolean[]>([]);
    let [start, setStart] = useState<boolean>(false);
    let [code, setCode] = useState<string>("");
    let [attempts, setAttempts] = useState<number>(0);

    useEffect(() => {
        const disableContextMenu = (event: MouseEvent) => { event.preventDefault(); };

        const disableDevTools = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'I') { event.preventDefault(); }
            if (event.ctrlKey && event.shiftKey && event.key === 'J') { event.preventDefault(); }
            if (event.ctrlKey && event.key === 'U') { event.preventDefault(); }
            if (event.key === 'F12') { event.preventDefault(); }
        };

        document.addEventListener('contextmenu', disableContextMenu);
        document.addEventListener('keydown', disableDevTools);

        return () => {
            document.removeEventListener('contextmenu', disableContextMenu);
            document.removeEventListener('keydown', disableDevTools);
        };
    }, []);

    useEffect(() => {
        let h = window.location.hash;
        setCode(h.length ? h.substring(1) : "");
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            LoadData(code, selectedItem, attempts);
        }, RefreshTime);

        return () => clearInterval(interval);
    }, [code, selectedItem, attempts]);

    const LoadData = async (code: string, item: string, errors: number) => {
        if (errors >= MaxRequests) { return; }
        else if (code.length < 6) { setAttempts(5); }
        let a = await FetchGame(code, item);
        if (a) {
            setGame(a);
            setStart(true);
            setChecked(prevChecked => !prevChecked.length ? new Array(a.allPlayers.filter(p => p.team !== a.activePlayer.team).length).fill(false) : prevChecked);
        }
        else { setAttempts(prev => prev + 1); }
    }

    const ReturnToMenu = () => {
        let h = window.location.hash;
        setGame(null);
        setStart(false);
        setChecked([]);
        setAttempts(0);
        setSelectedItem("4403");
        setCode(h.length ? h.substring(1) : "");
    }

    const onCodeChange = (n: string) => {
        setCode(n);
        if (n.length == 6) { setAttempts(0); }
    }

    return <>
        {code.length == 6 && start ? (
            game ? (
                <div className="container mx-auto xl:flex xl:gap-5">
                    <div className="mt-5 max-w-4xl lg:w-full lg:max-w-none xl:w-fit xl:max-w-4xl">
                        <Card game={game} />
                        <Break />
                        <Scoreboard game={game} setChecked={setChecked} code={code} />
                        <Break />
                        <div onClick={ReturnToMenu} className="cursor-pointer justify-center p-4 w-full bg-[#300415] hover:bg-pink-950 transition-all duration-200 flex gap-2 items-center shade">
                            <img className="h-5" src="/back.svg" alt="" />
                            <p className="text-white font-bold dropshadow">Go back to menu</p>
                        </div>
                    </div>
                    <div className="flex flex-col max-w-4xl lg:w-full lg:max-w-none xl:w-auto xl:max-w-4xl">
                        {(() => {
                            let { relevant, champion, tool } = game.activePlayer;
                            let { abilities, items, runes, spell } = relevant;
                            let enemies = game.allPlayers.filter(p => p.team !== game.activePlayer.team);
                            return (
                                <>
                                    <Break />
                                    <Sources
                                        abilities={abilities}
                                        champion={champion}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        enemies={enemies}
                                        checked={checked}
                                    />
                                    <Break />
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
                                        checked={checked}
                                    />
                                    <Break />
                                    <Selector
                                        abilities={abilities}
                                        items={items}
                                        runes={runes}
                                        spell={spell}
                                        champion={champion}
                                        enemies={enemies}
                                        checked={checked}
                                    />
                                    <Break />
                                </>
                            );
                        })()}
                    </div>
                </div>
            ) : (<>
                <Loading />
            </>)
        ) : (
            <>
                <Awaiter onCodeChange={onCodeChange} attempts={attempts} />
            </>
        )}
    </>
}