import { useEffect, useState } from "react"
import { BrowserData } from "./types-calculator"
import { DataProps, Response } from "./types-realtime"
import { DisableDevTools, EndPoint } from "./constants";
import Break from "./components/break";
import Sources from "./components/tables/sources";
import Tool from "./components/tables/tool";
import Selector from "./components/selector";
import Loading from "./components/loading";
import Scoreboard from "./components/scoreboard";
import Card from "./components/card";
import DropdownChampions from "./components/dropdown/calculator/champions";
import DropdownItems from "./components/dropdown/calculator/items";
import DropdownRunes from "./components/dropdown/calculator/runes";
import Replacements from "./replacements";

const FetchGame = async (data: BrowserData, item: string, rec: boolean): Promise<DataProps | null> => {
    const T1 = new Date();
    var o = { data, item, rec };
    try {
        let x = await fetch(EndPoint + "/api/game/calculator", {
            method: "POST",
            body: JSON.stringify(o),
            headers: { "Content-Type": "application/json" }
        });
        let y = await x.json() as Response;
        const T2 = new Date();
        const TIME = (T2.getTime() - T1.getTime()) / 1000;
        console.log(TIME);
        if (y.success) { return JSON.parse(y.data.game) as DataProps; }
        else { throw new Error(y.message) }
    }
    catch (e) { console.log(e); }
    return null;
}

export default function Calculator() {
    let [data, setData] = useState<BrowserData>({
        activePlayer: {
            abilities: {
                E: { abilityLevel: 5 },
                Q: { abilityLevel: 5 },
                R: { abilityLevel: 3 },
                W: { abilityLevel: 5 }
            },
            championStats: {
                abilityPower: 0.0,
                armor: 0.0,
                attackDamage: 0.0,
                attackRange: 0.0,
                attackSpeed: 0.0,
                critChance: 0.0,
                critDamage: 0.0,
                currentHealth: 0.0,
                magicPenetrationFlat: 0.0,
                magicPenetrationPercent: 1.0,
                physicalLethality: 0.0,
                armorPenetrationPercent: 1.0,
                magicResist: 0.0,
                maxHealth: 0.0,
                resourceMax: 0.0
            },
            level: 18,
            runes: [],
            items: [],
            team: "CHAOS",
            summonerName: "You",
            championName: "Neeko",
            championId: "Neeko"
        },
        allPlayers: [
            {
                championName: "Vex",
                level: 18,
                items: [],
                runes: [],
                summonerName: "Enemy 1",
                team: "ORDER"
            },
            {
                championName: "Yasuo",
                items: [],
                runes: [],
                level: 18,
                summonerName: "Enemy 2",
                team: "ORDER"
            }
        ],
        dragons: {
            ORDER: [],
            CHAOS: []
        },
        mapNumber: 11
    })
    let [game, setGame] = useState<DataProps | null>(null);
    let [selectedItem, setSelectedItem] = useState<string>("4403");
    let [checked, setChecked] = useState<boolean[]>([]);
    let [start, setStart] = useState<boolean>(false);
    let [recommend, setRecommend] = useState<boolean>(false);

    let [dropChampion, setDropChampion] = useState<boolean>(false);
    let [dropItems, setDropItems] = useState<boolean>(false);
    let [dropRunes, setDropRunes] = useState<boolean>(false);

    // DisableDevTools();

    useEffect(() => {
        // LoadData(data, selectedItem, recommend);
    }, [data, selectedItem, recommend]);

    const LoadData = async (data: BrowserData, item: string, rec: boolean) => {
        let a = await FetchGame(data, item, rec);
        if (a) {
            setGame(a);
            setStart(true);
            setChecked(prevChecked => !prevChecked.length ? new Array(a.allPlayers.filter(p => p.team !== a.activePlayer.team).length).fill(false) : prevChecked);
        }
    }

    const ReturnToMenu = () => {
        setGame(null);
        setStart(false);
        setChecked([]);
        setSelectedItem("4403");
    }

    const ToggleRecommend = () => recommend ? setRecommend(false) : setRecommend(true);

    return (
        <div className="grid grid-cols-2 gap-4 p-2">
            <div className="flex flex-col gap-2 bg-zinc-900">
                <div className="p-2 gap-2 flex items-center">
                    {["Yourself", "Enemies"].map((x, i) => <div key={x + i} className="bg-zinc-800 dropshadow text-white p-2 border border-zinc-600">{x}</div>)}
                </div>
                <div className="flex flex-col bg-zinc-800 border border-zinc-600 p-4">
                    <span className="text-white font-bold">{data.activePlayer.championName}</span>
                    <DropdownChampions />
                </div>
                <div className="flex flex-col bg-zinc-800 border border-zinc-600 p-4">
                    <span className="text-white font-bold">Items</span>
                    <DropdownItems />
                </div>
                <div className="flex flex-col bg-zinc-800 border border-zinc-600 p-4">
                    <span className="text-white font-bold">Runes</span>
                    <DropdownRunes />
                </div>
            </div>
            <div className="flex flex-col gap-2 bg-zinc-800">
                <Replacements championStats={data.activePlayer.championStats} />
            </div>
            {/* {game ? (
                <div className="container mx-auto xl:flex xl:gap-5">
                    <div className="mt-5 max-w-4xl lg:w-full lg:max-w-none xl:w-fit xl:max-w-4xl">
                        <Card game={game} />
                        <Break />
                        <div onClick={ReturnToMenu} className="cursor-pointer justify-center p-4 w-full bg-[#300415] hover:bg-pink-950 transition-all duration-200 flex gap-2 items-center shade">
                            <img className="h-5" src="/back.svg" alt="" />
                            <p className="text-white font-bold dropshadow">Go back to menu</p>
                        </div>
                        <Break />
                        <div className="shade flex flex-col gap-2 bg-zinc-900 p-4">
                            <h1 className="text-center text-white font-bold text-lg">Important information</h1>
                            <span className="text-zinc-400 px-8">
                                <p className="list-item my-2">Item recommendations are 100% based on <span className="text-blue-300 font-bold">Damage</span></p>
                                <p className="list-item my-2">They usually lowers FPS and decrease update rate</p>
                                <p className="list-item my-2">TutorLoL will not work on <span className="text-blue-300 font-bold">Arena</span><span className="text-blue-300 font-bold">, TFT</span>, and <span className="text-blue-300 font-bold">Swarm</span></p>
                            </span>
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
                                        onRecommendClick={ToggleRecommend}
                                        checked={checked}
                                        recommend={recommend}
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
            ) : <Loading />} */}
        </div>
    )
}