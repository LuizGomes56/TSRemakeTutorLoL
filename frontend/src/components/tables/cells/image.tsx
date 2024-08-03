export default function ImageCells({ src, alt, letter, onMouseOver, onMouseOut }: { src: string, alt: string, letter?: string, onMouseOver?: () => void, onMouseOut?: () => void }) {
    return (
        <th onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <span>
                <img src={src} alt={alt}></img>
                {letter && (
                    <h2>
                        {letter.length > 1 ? (
                            <>
                                {letter.charAt(0)}
                                <sub>{letter.charAt(1)}</sub>
                            </>
                        ) : letter}
                    </h2>
                )}
            </span>
        </th>
    )
};