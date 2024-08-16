export default function Searchbar({ event, text }: { event: (e: React.ChangeEvent<HTMLInputElement>) => void, text: string }) {
    return (
        <div className="flex items-center relative">
            <input
                type="text"
                placeholder="Search for an item"
                value={text}
                onInput={event}
                className="darkblue:text-blue-200 darkblue:placeholder:text-blue-300 placeholder:font-bold h-12 placeholder:text-zinc-300 pl-12 w-full text-zinc-300 darkblue:bg-slate-800 bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-800"
            />
            <img className="h-5 absolute left-4" src="/search.svg" alt="Search" />
        </div>
    )
}