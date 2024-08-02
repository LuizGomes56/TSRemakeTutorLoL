import { useEffect, useState, forwardRef } from "react"
import { EvalItemStats } from "../interfaces";
import Searchbar from "./dropdown/searchbar";
import { EndPoint } from "../constants";
import Filters from "./dropdown/filters";
import Cells from "./dropdown/cells";

const FetchItems = async (): Promise<Record<string, EvalItemStats> | void> => {
    try {
        let response = await fetch(EndPoint + "/api/lol/all/items", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        let data = await response.json() as Record<string, EvalItemStats>;
        return data;
    } catch (error) {
        console.log(error);
    }
}

const Dropdown = forwardRef<HTMLDivElement, { map: string, onItemClick: (item: string) => void }>(({ map, onItemClick }, ref) => {
    let [obj, setObj] = useState<null | Record<string, EvalItemStats>>(null);
    let [text, setText] = useState<string>("");
    let [filter, setFilter] = useState<string[]>([]);

    useEffect(() => {
        LoadStats();
    }, []);

    const LoadStats = async () => {
        let items = await FetchItems() as Record<string, EvalItemStats>;
        setObj(items);
    }

    const InputEvent = (e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value); }

    const FilterEvent = (stat: string) => {
        setFilter(prev => {
            return prev.includes(stat) ? prev.filter(s => s !== stat) : [...prev, stat];
        });
    }

    return (
        <div ref={ref} className="p-1 z-50 bg-neutral-950 fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-80 lg:min-w-[445px]">
            <Searchbar event={InputEvent} text={text} />
            {obj &&
                <div className="mt-1 flex gap-1 max-h-80">
                    <Filters onFilter={FilterEvent} />
                    <Cells x={obj} t={text} m={map} f={filter} onItemClick={onItemClick} />
                </div>}
        </div>
    )
})

export default Dropdown;