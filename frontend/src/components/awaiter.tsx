import { useEffect, useRef, useState } from "react";
import { PreviewCode } from "../constants";

export default function Awaiter({ onCodeChange, attempts }: { onCodeChange: (code: string) => void, attempts: number }) {
    let [hash, setHash] = useState<string>("");
    let inputRef = useRef<HTMLInputElement>(null);
    let u = attempts >= 5;

    useEffect(() => {
        let x = window.location.hash;
        let y = x.substring(1)
        if (y) {
            setHash(y);
            if (inputRef.current) { inputRef.current.placeholder = y; }
        }
    }, [])

    const InputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value;
        if (/^\d{0,6}$/.test(v)) { onCodeChange(v); }
    };

    const Keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) { return; }
        if (!/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); }
    };

    const setInputToHash = () => {
        if (inputRef.current) {
            inputRef.current.value = hash;
            onCodeChange(hash);
        }
    };

    let t = u ? "bg-yellow-300 text-yellow-100 bg-opacity-20" : "bg-sky-950 text-sky-100";

    return (
        <div className="h-screen flex items-center flex-col w-full">
            <div className="mt-24 bg-zinc-900 rounded">
                <div className="flex flex-col items-center">
                    <div className={`flex items-center rounded-t w-full justify-center p-3 gap-4 ${t}`}>
                        <img className={`h-6 ${u ? "" : "animate-spin"}`} src={`/${u ? "warning" : "load"}.svg`} alt="W" />
                        <h2 className="font-bold text-xl">{u ? "Error while trying to load game" : "Trying to load your game"}</h2>
                    </div>
                    <div className="flex justify-center flex-col gap-4 p-4 w-full bg-zinc-900 hover:bg-zinc-950 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="shade bg-zinc-900 p-2 rounded">
                                <img className="h-6" src="/code.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Friend code</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Enter your friend code to see their live game</p>
                            </span>
                        </div>
                        <div className="flex items-center relative">
                            <input
                                ref={inputRef}
                                onChange={InputEvent}
                                onKeyDown={Keydown}
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="000000"
                                className="focus:outline-none focus:ring-1 text-lg focus:ring-zinc-400 rounded text-white w-full h-10 font-mono bg-zinc-900 placeholder:text-zinc-400 placeholder:text-lg font-bold text-center"
                            />
                            <img onClick={setInputToHash} className="right-0 absolute h-10 bg-zinc-900 hover:bg-zinc-700 transition-all duration-200 rounded-r" src="/return.svg" alt="" />
                        </div>
                    </div>
                    <a href="/calculator" className="flex items-center gap-4 cursor-pointer p-4 w-full bg-zinc-900 hover:bg-zinc-950 transition-all duration-300">
                        <span className="shade bg-zinc-900 p-2 rounded">
                            <img className="h-6" src="/calculator.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-white">Calculator</p>
                            <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Test builds and damage outside of a game</p>
                        </span>
                    </a>
                    <div onClick={() => onCodeChange(PreviewCode)} className="flex items-center gap-4 cursor-pointer p-4 w-full bg-zinc-900 hover:bg-zinc-950 transition-all duration-300 rounded-b">
                        <span className="shade bg-zinc-900 p-2 rounded">
                            <img className="h-6" src="/preview.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-white">Preview</p>
                            <p className="dropshadow text-zinc-400 text-xs sm:text-sm">How your game information will be displayed</p>
                        </span>
                    </div>
                    {u && <div onClick={() => onCodeChange(hash)} className="flex items-center gap-4 cursor-pointer p-4 w-full bg-emerald-950 hover:bg-teal-950 transition-all duration-300 rounded-b">
                        <span className="bg-zinc-900 shadow-sm shadow-zinc-950 p-2 rounded">
                            <img className="h-6" src="/retry.svg" alt="" />
                        </span>
                        <span>
                            <p className="dropshadow text-emerald-300 font-bold">Load my game</p>
                            <p className="dropshadow text-emerald-200 text-xs sm:text-sm">Click to retry loading a current game 5 times</p>
                        </span>
                    </div>}
                </div>
            </div>
        </div>
    );
}
