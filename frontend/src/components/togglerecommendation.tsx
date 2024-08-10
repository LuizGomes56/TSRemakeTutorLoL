export default function ToggleRecommendation({ x, ClickEvent }: { x: boolean, ClickEvent: () => void }) {
    return <button type="button" onClick={ClickEvent} className="h-14 w-full bg-zinc-900 text-zinc-300 font-bold hover:bg-zinc-800 transition-all duration-200">Recommend items: {x ? "ON" : "OFF"}</button>
}