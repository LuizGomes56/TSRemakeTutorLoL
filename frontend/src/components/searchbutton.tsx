export default function Searchbutton({ click }: { click: () => void }) {
    return (
        <div className="flex items-center relative bg-neutral-900 text-neutral-300 font-bold hover:bg-neutral-800 transition-all duration-200">
            <div className="absolute inset-0 flex items-center justify-center gap-2">
                <img className="h-6" src="/search.svg" alt="Search" />
                <span>Search for an item</span>
            </div>
            <button
                aria-label="Search"
                onClick={click}
                className="w-full opacity-0 h-14"
                type="button">Search
            </button>
        </div>
    )
}