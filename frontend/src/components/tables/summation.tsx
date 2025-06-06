import { champion } from "../../constants";
import { CalculatorProps } from "../../types-calculator";
import { Ply, Tag } from "../../types-realtime";
import ChampionCells from "./cells/champion";
import ImageCells from "./cells/image";

const TextCells = ({ enemy, instance }: { enemy: Ply | CalculatorProps["allPlayers"][number], instance: Tag[] }) => {
    let s = 0;
    let h = enemy.championStats.maxHealth;
    instance.forEach(x => {
        let d = enemy.damage;
        let y = x.id;
        let z = x.key;
        let w = x.mod;
        let t = d[z];
        let u = t[y as keyof typeof t][w];
        s += u;
    })
    return (
        <>
            <td className="px-3 text-sm min-w-16">{Math.round(s)}</td>
            <td className="px-3 text-sm min-w-16">{Math.round(h - s)}</td>
            <td className="px-3 text-sm min-w-16">{Math.round(100 * s / h) + "%"}</td>
        </>
    )
}

export default function Summation({ enemies, instance, checked }: { enemies: Ply[] | CalculatorProps["allPlayers"], instance: Tag[], checked: boolean[] }) {
    return (
        <>
            <div className="overflow-auto">
                <table>
                    <thead>
                        <tr className="bg-[#1f1f1f]">
                            <th><p>Name</p></th>
                            <ImageCells src={"/sum.svg"} alt="Sum" />
                            <ImageCells src={"/health.svg"} alt="HP" />
                            <ImageCells src={"/percent.svg"} alt="Percent" />
                        </tr>
                    </thead>
                    <tbody>
                        {enemies.map((x, i) => (
                            <tr key={i} className={checked[i] ? "hidden" : ""}>
                                <ChampionCells src={champion(x.champion.id)} alt={x.champion.name} name={x.champion.name} />
                                <TextCells enemy={x} instance={instance} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}