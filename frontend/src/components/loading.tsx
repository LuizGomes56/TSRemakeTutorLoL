import Load from "./tables/load";

export default function Loading() {
    return (
        <div className="container mx-auto lg:flex lg:gap-5 p-4">
            <div className="lg:w-2/5 w-full lg:mt-5 flex flex-col gap-5">
                <Load />
                <Load />
            </div>
            <div className="lg:w-3/5 w-full flex flex-col mt-5 gap-5">
                <Load />
                <Load />
                <div className="darkblue:bg-slate-900 bg-neutral-900 grid grid-cols-3 p-4 gap-4">
                    <Load />
                    <Load />
                    <Load />
                </div>
            </div>
        </div>
    )
}