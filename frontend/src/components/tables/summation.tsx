import { champion } from "../../constants";
import { Ply, Tag } from "../../interfaces";
import ChampionCells from "./cells/champion";
import ImageCells from "./cells/image";

const TextCells = ({ enemy, instance }: { enemy: Ply, instance: Tag[] }) => {
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
            <td className="px-3 text-sm">{Math.round(s)}</td>
            <td className="px-3 text-sm">{Math.round(h - s)}</td>
            <td className="px-3 text-sm">{Math.round(100 * s / h) + "%"}</td>
        </>
    )
}

export default function Summation({ enemies, instance }: { enemies: Ply[], instance: Tag[] }) {
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
                            <tr key={i}>
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