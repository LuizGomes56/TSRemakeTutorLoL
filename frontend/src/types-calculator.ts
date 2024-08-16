import { CoreStats, Damages, DragonProps, RelevantProps, TargetChampion, ToolInfo, ToolProps } from "./types-realtime";

type Team = "CHAOS" | "ORDER";

export type ChampionStats = {
    abilityPower: number;
    armor: number;
    attackDamage: number;
    attackRange: number;
    attackSpeed: number;
    critChance: number;
    critDamage: number;
    currentHealth: number;
    magicPenetrationFlat: number;
    magicPenetrationPercent: number;
    physicalLethality: number;
    armorPenetrationPercent: number;
    magicResist: number;
    maxHealth: number;
    resourceMax: number;
}

interface ActivePlayer {
    abilities: {
        E: { abilityLevel: number };
        Q: { abilityLevel: number };
        R: { abilityLevel: number };
        W: { abilityLevel: number };
    };
    championStats: ChampionStats;
    team: Team;
    items: string[];
    runes: string[];
    level: number;
    summonerName: string;
    championName: string;
    championId: string;
}

interface AllPlayers {
    championName: string;
    items: string[];
    level: number;
    summonerName: string;
    team: Team;
    statbased: boolean;
}

interface Dragons {
    ORDER: string[];
    CHAOS: string[];
}

export type BrowserData = {
    activePlayer: ActivePlayer;
    allPlayers: AllPlayers[];
    dragons: Dragons;
    mapNumber: number;
    position: string;
    statbased: boolean;
}

export const InitialDataState: BrowserData = {
    activePlayer: {
        abilities: {
            E: {
                abilityLevel: 5
            },
            Q: {
                abilityLevel: 5
            },
            R: {
                abilityLevel: 3
            },
            W: {
                abilityLevel: 5
            }
        },
        championStats: {
            abilityPower: 0.0,
            armor: 0.0,
            attackDamage: 0.0,
            attackRange: 0.0,
            attackSpeed: 0.0,
            critChance: 0.0,
            critDamage: 0.0,
            currentHealth: 0.0,
            magicPenetrationFlat: 0.0,
            magicPenetrationPercent: 0.0,
            physicalLethality: 0.0,
            armorPenetrationPercent: 0.0,
            magicResist: 0.0,
            maxHealth: 0.0,
            resourceMax: 0.0
        },
        level: 18,
        team: "CHAOS",
        items: ["3089", "4645", "3020", "3135", "3157", "3115"],
        runes: ["8112", "8143"],
        summonerName: "You",
        championName: "Neeko",
        championId: "Neeko"
    },
    allPlayers: [
        {
            championName: "Gwen",
            items: ["3102"],
            level: 18,
            summonerName: "Enemy 1",
            team: "ORDER",
            statbased: true
        },
        {
            championName: "Nunu",
            items: ["4401", "6665", "3111", "3065", "3068", "2502"],
            level: 18,
            summonerName: "Enemy 2",
            team: "ORDER",
            statbased: true
        },
        {
            championName: "Ahri",
            items: [],
            level: 18,
            summonerName: "Enemy 3",
            team: "ORDER",
            statbased: true
        },
        {
            championName: "Ashe",
            items: [],
            level: 18,
            summonerName: "Enemy 4",
            team: "ORDER",
            statbased: true
        },
        {
            championName: "Braum",
            items: [],
            level: 18,
            summonerName: "Enemy 5",
            team: "ORDER",
            statbased: true
        }
    ],
    dragons: {
        CHAOS: [],
        ORDER: []
    },
    mapNumber: 11,
    position: "MIDDLE",
    statbased: true
}

export interface ExtendsActivePlayer {
    championName: string;
    champion: TargetChampion;
    dragon: DragonProps;
    items: string[];
    baseStats: CoreStats;
    bonusStats: CoreStats;
    team: string;
    skin: number;
    tool: ToolInfo;
    relevant: {
        abilities: RelevantProps;
        items: RelevantProps;
        runes: RelevantProps;
        spell: RelevantProps;
    };
}

export interface ExtendsPlayer {
    champion: TargetChampion;
    dragon: DragonProps;
    bonusStats: CoreStats;
    baseStats: CoreStats;
    championStats: CoreStats;
    damage: Damages;
    tool?: ToolProps;
}

export type Acp = ActivePlayer & ExtendsActivePlayer;
export type Ply = AllPlayers & ExtendsPlayer;

export interface CalculatorProps extends BrowserData {
    activePlayer: Acp;
    allPlayers: Array<Ply>;
}

export const fuzzySearch = (q: string, n: string): boolean => {
    const a = q.replace(/\s+/g, '').toLowerCase();
    const b = n.replace(/\s+/g, '').toLowerCase();
    let i = 0;
    for (let c of b) {
        if (c === a[i]) { i++; }
        if (i === a.length) { return true; }
    }
    return false;
};