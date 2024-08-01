import { Tip } from "../interfaces";

export default function Tooltip({ x }: { x: Tip }) {
    return x ? (
        <div className="z-50 fixed left-1/2 top-1/4 transform -translate-x-1/2 border border-slate-500 max-w-96 flex flex-col gap-2 bg-gray-900 text-white p-3 rounded">
            <div className="border-b border-b-slate-500 pb-2 flex justify-between items-center gap-6 min-w-48 w-full">
                <span className="flex items-center gap-2">
                    <img src={x.s} alt={x.n} className="rounded h-8 w-8" />
                    <h3 className="text-lg font-bold">{x.n}</h3>
                </span>
                <span className="flex items-center">
                    {x.r ? (
                        <>
                            {x.r.map((k, i) => (
                                <span key={i}>
                                    {k}
                                    {x.r && i !== x.r.length - 1 && '/'}
                                </span>
                            ))}
                            <img className="ml-2 w-5" src="/time.svg" alt="CD" />
                        </>
                    ) : null}
                </span>
            </div>
            <p className="text-wrap text-slate-300 min-w-48 w-full text-xs">{x.d}</p>
        </div>
    ) : null;
};