import { item, rune, spell } from '../../../constants';
import { RequiredProps, ToolInfo } from '../../../interfaces';
import ImageCells from './image';
import VoidCells from './void';

const spellPath = spell

// Defina os tipos para os props que o componente vai receber
type TableHeaderProps = RequiredProps & {
    tool?: ToolInfo;
    onMouseOver?: (s: string, n?: string, d?: string, r?: number[]) => () => void;
    onMouseOut?: () => void;
};

export default function TableHeader({ abilities, champion, runes, spell, items, tool, onMouseOver, onMouseOut }: TableHeaderProps) {
    return (
        <tr>
            <VoidCells />
            {abilities.min.map((x, i) => {
                let w = x[0];
                let l = ["A", "C"].includes(w);
                let c = champion;
                let s = l ? spellPath(w) : spellPath(c.id + w);
                let a = ["Q", "W", "E", "R"];
                let h = w == "P";
                let v = c.spells[a.indexOf(w)];
                let d = !l ? (h ? c.passive.description : v.description) : undefined;
                let n = !l ? (h ? c.passive.name : v.name) : undefined;
                let r = !l ? (h ? [] : v.cooldown) : undefined;
                return (
                    <ImageCells
                        key={x + i}
                        src={s}
                        alt={c.name}
                        letter={!l ? x : undefined}
                        onMouseOver={d && n ? onMouseOver && onMouseOver(s, n, d, r) : undefined}
                        onMouseOut={d && n ? onMouseOut : undefined}
                    />
                );
            })}
            {runes.min.map((x, i) => (
                <ImageCells key={i} src={rune(x)} alt={x} />
            ))}
            {spell.min.map((x, i) => (
                <ImageCells key={i} src={rune(x)} alt={x} />
            ))}
            {items.min.map((x, i) => (
                <ImageCells key={i} src={item(x)} alt={x} />
            ))}
            {tool?.active && !items.min.includes(tool.id) && <ImageCells src={item(tool.id)} alt={tool.id} />}
        </tr>
    );
}
