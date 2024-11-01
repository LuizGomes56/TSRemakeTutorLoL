import { useEffect } from 'react';

export const EndPoint = "http://localhost:8080";
export const RefreshTime = 950;
export const MaxRequests = 15;
export const PreviewCode = "401085";

export const Style = {
    damages: {
        physical: "text-orange-600",
        magic: "text-cyan-500",
        true: "text-slate-300",
        mixed: "text-purple-700"
    },
    dropdown: {
        main: "flex flex-col max-h-64 overflow-y-auto bg-slate-900 rounded px-2 border border-slate-700",
        cell: "p-1 flex gap-2 items-center hover:bg-slate-700 transition-all duration-200",
        image: "h-6",
        text: "text-sky-200 font-inter font-medium dropshadow text-sm"
    }
}

const path = "/img";

export const spell = (id: string) => `${path}/spell/${id}.png`;
export const item = (id: string) => `${path}/item/${id}.png`;
export const rune = (id: string) => `${path}/rune/${id}.png`;
export const champion = (id: string) => `${path}/champion/${id}.png`;
export const symbol = (id: string) => `${path}/symbol/${id}.png`;
export const stat = (id: string) => `${path}/stat/${id}.png`;
export const centered = (id: string) => `${path}/centered/${id}.jpg`;
export const splash = (id: string) => `${path}/splash/${id}.jpg`;

export const allStats: string[] = [
    "Ability Power",
    "Magic Penetration",
    "Attack Damage",
    "Armor Penetration",
    "Critical Strike Chance",
    "Health",
    "Armor",
    "Magic Resist",
    "Attack Speed"
];

export const DisableDevTools = () => {
    useEffect(() => {
        const disableContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        const disableDevTools = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'I') {
                event.preventDefault();
            }
            if (event.ctrlKey && event.shiftKey && event.key === 'J') {
                event.preventDefault();
            }
            if (event.ctrlKey && event.key === 'U') {
                event.preventDefault();
            }
            if (event.key === 'F12') {
                event.preventDefault();
            }
        };

        document.addEventListener('contextmenu', disableContextMenu);
        document.addEventListener('keydown', disableDevTools);

        return () => {
            document.removeEventListener('contextmenu', disableContextMenu);
            document.removeEventListener('keydown', disableDevTools);
        };
    }, []);
};

export const Keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) { return; }
    if (!/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); }
};
