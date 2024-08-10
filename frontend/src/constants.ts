export const EndPoint = "http://localhost:3000";
export const RefreshTime = 1500;
export const MaxRequests = 15;
export const PreviewCode = "401085";

export const Style = {
    damages: {
        physical: "text-orange-600",
        magic: "text-cyan-500",
        true: "text-slate-300",
        mixed: "text-purple-700"
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
