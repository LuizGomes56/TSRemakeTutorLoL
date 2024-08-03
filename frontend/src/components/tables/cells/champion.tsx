export default function ChampionCells({ src, alt, name }: { src: string, alt: string, name?: string }) {
    return (
        <td>
            {name ?
                <div className="flex items-center gap-2">
                    <img src={src} alt={alt} />
                    <p className="drposhadow">{name}</p>
                </div> : <img src={src} alt={alt} />}
        </td>
    );
}
