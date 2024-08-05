export default function ChampionCells({ src, alt, name }: { src: string, alt: string, name?: string }) {
    return (
        <td>
            {name ?
                <div className="flex items-center gap-2">
                    <img src={src} alt={alt} />
                    <p className="drposhadow text-sm">{name}</p>
                    {/* {`${name.split(" ")[0]} ${name.split(" ")[1].charAt(0)}.`} */}
                </div> : <img src={src} alt={alt} />}
        </td>
    );
}
