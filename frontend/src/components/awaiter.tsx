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
    let [darkblue, setDarkblue] = useState<boolean>(true);
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

    let t = u ? "bg-zinc-700 darkblue:bg-slate-700" : "bg-sky-950";

    return (
        <div className="min-h-screen flex items-center flex-col w-full">
            <div className="sm:bg-zinc-900 darkblue:bg-slate-900 py-8 px-2 sm:px-16 h-full sm:border border-zinc-800">
                <div className={`mb-2 flex items-center w-full py-3 px-4 gap-3.5 ${t} border border-transparent`}>
                    <span className="shade rounded p-2 bg-zinc-700 darkblue:bg-slate-700">
                        <img className={`w-6 h-6 min-w-6 min-h-6 ${u ? "" : "animate-spin"}`} src={`/${u ? "warning" : "load"}.svg`} alt="W" />
                    </span>
                    <span>
                        <p className="text-white font-bold text-lg sm:text-xl dropshadow">{u ? "Error while trying to load game" : "Trying to load your game"}</p>
                        <p className="text-zinc-400 text-xs sm:text-sm dropshadow">Leave champion selection to load your data</p>
                    </span>
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                    <div className="flex flex-col items-center px-6 darkblue:bg-slate-800 bg-zinc-800">
                        <div className="flex justify-center pl-2.5 pr-5 pt-1 bg-zinc-800 darkblue:bg-slate-800">
                            <div className="h-20 flex gap-3 w-full items-center">
                                <span className="flex flex-col">
                                    <span className="flex items-center">
                                        <img className="h-10" src="/logo.svg" alt="" />
                                        <p className="dropshadow font-inter font-medium text-xl text-white">TutorLoL</p>
                                    </span>
                                    <p className="ml-2.5 dropshadow text-zinc-400 text-xs sm:text-sm">Damage calculator</p>
                                </span>
                                <img className="h-10 mt-0.5" src="/lol.svg" alt="" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 w-full bg-zinc-800 darkblue:bg-slate-800 border border-transparent">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="h-6 w-8" src="/version.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Patch {version}</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">League's version being used</p>
                            </span>
                        </div>
                        {hash.length == 0 && <a href="https://apps.microsoft.com/store/detail/XP8JR4SN1PKPPH" className="flex items-center cursor-pointer gap-4 p-4 w-full darkblue:bg-slate-700 darkblue:hover:bg-slate-600 bg-zinc-700 hover:bg-zinc-600 hover:border-zinc-500 transition-all duration-300">
                            <span className="shade bg-zinc-600 darkblue:bg-slate-600 p-2 rounded">
                                <img className="h-6 w-8" src="/store.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Download app</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Download to use Real Time</p>
                            </span>
                        </a>}
                        <div className="flex items-center gap-4 p-4 w-full bg-zinc-800 darkblue:bg-slate-800">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="h-6 w-8" src="/PT.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Origin - São Paulo</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Country of origin</p>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 p-4 w-full bg-zinc-800 darkblue:bg-slate-800">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="h-6 w-8" src="/EN.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Server - Miami</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Estimated delay of 400ms</p>
                            </span>
                        </div>
                        <div className="flex items-center gap-4 p-4 w-full bg-zinc-800 darkblue:bg-slate-800">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="h-6 w-8" src="/device.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Work on any device</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Just go to tutorlol.com</p>
                            </span>
                        </div>


                    </div>
                    <div className="flex flex-col gap-2">
                        <div
                            onClick={() => {
                                document.body.classList.toggle("darkblue");
                                setDarkblue(p => p ? false : true);
                            }}
                            className="h-20 flex items-center gap-4 cursor-pointer p-4 w-full darkblue:bg-slate-800 darkblue:hover:bg-slate-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-transparent transition-all duration-300">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="w-6 h-6 min-w-6 min-h-6" src="/darkmode.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">{darkblue ? "Dark mode" : "Darkblue mode"}</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Click to activate a {darkblue ? "dark" : "darkblue"} theme</p>
                            </span>
                        </div>
                        <div className="flex justify-center flex-col gap-4 p-4 w-full darkblue:bg-slate-800 darkblue:hover:bg-slate-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-transparent transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
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
                                    className="focus:outline-none focus:ring-1 text-lg focus:ring-zinc-400 rounded text-white w-full h-10 font-mono bg-zinc-700 darkblue:bg-slate-700 placeholder:text-zinc-400 placeholder:text-lg font-bold text-center border border-zinc-500"
                                />
                                <img onClick={setInputToHash} className="cursor-pointer right-0 absolute h-10 bg-zinc-700 darkblue:bg-slate-700 hover:bg-zinc-500 transition-all duration-200 rounded-r border-y border-r border-zinc-500" src="/return.svg" alt="" />
                            </div>
                        </div>
                        <a href={`/calculator#${hash}`} className="h-20 flex items-center gap-4 cursor-pointer p-4 w-full darkblue:bg-slate-800 darkblue:hover:bg-slate-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-transparent transition-all duration-300">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="w-6 h-6 min-w-6 min-h-6" src="/calculator.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Calculator</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">Test builds and damage outside of a game</p>
                            </span>
                        </a>
                        <div onClick={() => onCodeChange(PreviewCode)} className="h-20 flex items-center gap-4 cursor-pointer p-4 w-full darkblue:bg-slate-800 darkblue:hover:bg-slate-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 border border-transparent transition-all duration-300">
                            <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                                <img className="w-6 h-6 min-w-6 min-h-6" src="/preview.svg" alt="" />
                            </span>
                            <span>
                                <p className="dropshadow text-white">Preview</p>
                                <p className="dropshadow text-zinc-400 text-xs sm:text-sm">How your game information will be displayed</p>
                            </span>
                        </div>
                    </div>
                </div>
                {u && <div onClick={() => onCodeChange(hash)} className="mt-2 flex items-center gap-4 cursor-pointer p-4 w-full bg-zinc-700 darkblue:bg-slate-700 hover:bg-zinc-600 hover:border-zinc-400 transition-all duration-300 border border-transparent">
                    <span className="shade bg-zinc-700 darkblue:bg-slate-700 p-2 rounded">
                        <img className="w-6 h-6 min-w-6 min-h-6" src="/retry.svg" alt="" />
                    </span>
                    <span>
                        <p className="dropshadow text-white font-bold">Retry</p>
                        <p className="dropshadow text-zinc-300 text-xs sm:text-sm">Try to load your game again for {MaxRequests} seconds</p>
                    </span>
                </div>}
            </div>
        </div>
    );
}