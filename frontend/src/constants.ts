export const EndPoint = "http://localhost:3000";
export const Style = {
    damages: {
        physical: "text-orange-600",
        magic: "text-cyan-500",
        true: "text-slate-300",
        mixed: "text-purple-700"
    }
}

const path = `${EndPoint}/img`;

export const spell = (id: string) => `${path}/spell/${id}.png`;
export const item = (id: string) => `${path}/item/${id}.png`;
export const rune = (id: string) => `${path}/rune/${id}.png`;
export const champion = (id: string) => `${path}/champion/${id}.png`;
export const symbol = (id: string) => `${path}/symbol/${id}.png`;
export const stat = (id: string) => `${path}/stat/${id}.png`;

export const allStats: string[] = [
    "AbilityPower",
    "MagicPenetration",
    "AttackDamage",
    "Lethality",
    "ArmorPenetration",
    "CriticalStrikeChance",
    "Health",
    "Armor",
    "MagicResist",
    "AttackSpeed",
    // "AbilityHaste",
    // "LifeSteal",
    // "BaseHealthRegen",
    // "BaseManaRegen",
    // "Crit",
    // "CriticalStrikeDamage",
    // "GoldPer10Minutes",
    // "HealandShieldPower",
    // "Level",
    // "Mana",
    // "MoveSpeed",
    // "Melee",
    // "Omnivamp",
    // "Onhit",
    // "Ranged",
    // "Tenacity"
];
