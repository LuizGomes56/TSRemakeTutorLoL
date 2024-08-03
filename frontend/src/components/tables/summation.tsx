import { champion } from "../../constants";
import { Ply } from "../../interfaces";
import ChampionCells from "./cells/champion";
import ImageCells from "./cells/image";
import VoidCells from "./cells/void";

export default function Summation({ enemies }: { enemies: Ply[] }) {
    return (
        <>
            <div className="overflow-auto shade">
                <table>
                    <thead>
                        <tr>
                            <VoidCells />
                            <ImageCells src={"/sum.svg"} alt="Sum" />
                            <ImageCells src={"/health.svg"} alt="HP" />
                            <ImageCells src={"/percent.svg"} alt="Percent" />
                        </tr>
                    </thead>
                    <tbody>
                        {enemies.map(x => (
                            <tr>
                                <ChampionCells src={champion(x.champion.id)} alt={x.champion.name} name={x.champion.name} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}