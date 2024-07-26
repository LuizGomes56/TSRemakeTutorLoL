export default function ChampionCells({ src, alt }: { src: string, alt: string }) {
    return (
        <td>
            <img src={src} alt={alt}></img>
        </td>
    )
}