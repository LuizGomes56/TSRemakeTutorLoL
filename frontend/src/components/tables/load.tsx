import VoidCells from "./cells/void";
import VoidBody from "./cells/voidtd";

export default function Load() {
    return (
        <table>
            <thead>
                <tr>
                    <VoidCells />
                </tr>
            </thead>
            <tbody>
                {[...Array(5)].map((_, j) => (
                    <tr key={j}>
                        <VoidBody />
                    </tr>
                ))}
            </tbody>
        </table>
    );
}