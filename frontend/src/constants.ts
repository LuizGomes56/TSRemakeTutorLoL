export const EndPoint = "http://localhost:3000";
export const Style = {
    damages: {
        physical: "text-orange-600",
        magic: "text-cyan-500",
        true: "text-slate-300",
        mixed: "text-purple-700"
    }
}

const path = /*EndPoint +*/"/img" // Local file frontend, instead of Backend;

export const spell = (id: string) => `${path}/spell/${id}.png`;
export const item = (id: string) => `${path}/item/${id}.png`;
export const rune = (id: string) => `${path}/rune/${id}.png`;
export const champion = (id: string) => `${path}/champion/${id}.png`;
export const symbol = (id: string) => `${path}/symbol/${id}.png`;
export const stat = (id: string) => `${path}/stat/${id}.png`;

export const allStats: string[] = [
    "Ability Power",
    "Magic Penetration",
    "Attack Damage",
    "Armor Penetration",
    "Critical Strike Chance",
    "Health",
    "Armor",
    "Magic Resist",
    "Attack Speed",
    // "Lethality",
    // "Ability Haste",
    // "Life Steal",
    // "Base Health Regen",
    // "Base Mana Regen",
    // "Crit",
    // "Critical Strike Damage",
    // "Gold Per 10 Minutes",
    // "Heal and Shield Power",
    // "Level",
    // "Mana",
    // "Move Speed",
    // "Melee",
    // "Omnivamp",
    // "Onhit",
    // "Ranged",
    // "Tenacity"
];
