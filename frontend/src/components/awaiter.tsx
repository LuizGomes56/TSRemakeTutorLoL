import { useEffect, useRef, useState } from "react";
import { EndPoint, Keydown, MaxRequests, PreviewCode } from "../constants";

const GetVersion = async () => {
    try {
        let x = await fetch(EndPoint + "/api/version");
        let y = await x.json() as { version: string };
        return y.version.split('.').slice(0, -1).join('.');
    }
    catch (e) { console.log(e); }
}

export default function Awaiter({ onCodeChange, attempts }: { onCodeChange: (code: string) => void, attempts: number }) {
    let [hash, setHash] = useState<string>("");
    let [version, setVersion] = useState<string>("14.10");
    let inputRef = useRef<HTMLInputElement>(null);
    let u = attempts >= 5;

    useEffect(() => {
        let x = window.location.hash;
        let y = x.substring(1);
        if (y) {
            setHash(y);
            if (inputRef.current) { inputRef.current.placeholder = y; }
        }
        GetVersion().then(v => setVersion(v ? v : "14.10"));
    }, [])

    const InputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value;
        if (/^\d{0,6}$/.test(v)) { onCodeChange(v); }
    };

    const setInputToHash = () => {
        if (inputRef.current) {
            inputRef.current.value = hash;
            onCodeChange(hash);
        }
    };

    let t = u ? "bg-zinc-700" : "bg-sky-950";

    return (
        <div className="h-screen flex items-center flex-col w-full">
            <div className="sm:bg-zinc-900 py-8 px-2 sm:px-16 h-full sm:border border-zinc-800">
                <div className="flex flex-col items-center gap-2">
                    <div className={`flex items-center w-full py-3 px-4 gap-3.5 ${t} border border-zinc-600`}>
                        <span className="shade rounded p-2 bg-zinc-700">
                            <img className={`w-6 h-6 min-w-6 min-h-6 ${u ? "" : "animate-spin"}`} src={`/${u ? "warning" : "load"}.svg`} alt="W" />
                        </span>
                        <span>
                            <p className="text-white font-bold text-lg sm:text-xl dropshadow">{u ? "Error while trying to load game" : "Trying to load your game"}</p>
                            <p className="text-zinc-400 text-xs sm:text-sm dropshadow">Leave champion selection to load your data</p>
                        </span>
                    </div>
                    <div className="flex items-center gap-4 p-4 w-full bg-zinc-800 border border-zinc-700">
                        <span className="shade bg-zinc-700 p-2 rounded">
                            <img className="w-6 h-6 min-w-6 min-h-6" src="/version.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-white">Patch {version}</p>
                            <p className="dropshadow text-zinc-400 text-xs sm:text-sm">League's version used to calculate damages</p>
                        </span>
                    </div>
                    <div className="flex justify-center flex-col gap-4 p-4 w-full bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-zinc-700 hover:bg-zinc-750 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="shade bg-zinc-700 p-2 rounded">
                                <img className="w-6 h-6 min-w-6 min-h-6" src="/code.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Friend code</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Enter your friend code to see their live game</p>
                            </span>
                        </div>
                        <div className="flex items-center relative mt-2">
                            <input
                                ref={inputRef}
                                onChange={InputEvent}
                                onKeyDown={Keydown}
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="000000"
                                className="focus:outline-none focus:ring-1 text-lg focus:ring-zinc-400 rounded text-white w-full h-10 font-mono bg-zinc-700 placeholder:text-zinc-400 placeholder:text-lg font-bold text-center border border-zinc-500"
                            />
                            <img onClick={setInputToHash} className="right-0 absolute h-10 bg-zinc-700 hover:bg-zinc-500 transition-all duration-200 rounded-r border-y border-r border-zinc-500" src="/return.svg" alt="" />
                        </div>
                    </div>
                    <a href="/calculator" className="flex items-center gap-4 cursor-pointer p-4 w-full bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-zinc-700 hover:bg-zinc-750 transition-all duration-300">
                        <span className="shade bg-zinc-700 p-2 rounded">
                            <img className="w-6 h-6 min-w-6 min-h-6" src="/calculator.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-white">Calculator</p>
                            <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Test builds and damage outside of a game</p>
                        </span>
                    </a>
                    <div onClick={() => onCodeChange(PreviewCode)} className="flex items-center gap-4 cursor-pointer p-4 w-full bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-zinc-700 hover:bg-zinc-750 transition-all duration-300">
                        <span className="shade bg-zinc-700 p-2 rounded">
                            <img className="w-6 h-6 min-w-6 min-h-6" src="/preview.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-white">Preview</p>
                            <p className="dropshadow text-zinc-400 text-xs sm:text-sm">How your game information will be displayed</p>
                        </span>
                    </div>
                    {u && <div onClick={() => onCodeChange(hash)} className="flex items-center gap-4 cursor-pointer p-4 w-full bg-zinc-700 hover:bg-zinc-600 hover:border-zinc-400 transition-all duration-300 border border-zinc-600">
                        <span className="shade bg-zinc-700 p-2 rounded">
                            <img className="w-6 h-6 min-w-6 min-h-6" src="/retry.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-white font-bold">Retry</p>
                            <p className="dropshadow text-zinc-300 text-xs sm:text-sm">Try to load your game again for {MaxRequests} seconds</p>
                        </span>
                    </div>}
                </div>
            </div>
        </div>
    );
}