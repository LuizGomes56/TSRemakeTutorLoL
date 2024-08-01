export default function Searchbar({ event, text }: { event: (e: React.ChangeEvent<HTMLInputElement>) => void, text: string }) {
    return (<div className="flex items-center relative">
        <input
            type="text"
            placeholder="Search for an item"
            value={text}
            onInput={event}
            className="h-12 placeholder:text-neutral-300 rounded pl-12 w-full text-neutral-300 bg-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-800"
        />
        <img className="h-5 absolute left-4" src="/search.svg" alt="Search" />
    </div>
    )
}