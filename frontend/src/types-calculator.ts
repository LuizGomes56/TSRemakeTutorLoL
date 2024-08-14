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
            magicPenetrationPercent: 1.0,
            physicalLethality: 0.0,
            armorPenetrationPercent: 1.0,
            magicResist: 0.0,
            maxHealth: 0.0,
            resourceMax: 0.0
        },
        level: 18,
        team: "CHAOS",
        items: [],
        runes: [],
        summonerName: "You",
        championName: "Neeko",
        championId: "Neeko"
    },
    allPlayers: [
        {
            championName: "Mordekaiser",
            items: [],
            level: 18,
            summonerName: "Enemy 1",
            team: "ORDER"
        },
        {
            championName: "Viego",
            items: [],
            level: 18,
            summonerName: "Enemy 2",
            team: "ORDER"
        },
        {
            championName: "Ahri",
            items: [],
            level: 18,
            summonerName: "Enemy 3",
            team: "ORDER"
        },
        {
            championName: "Ezreal",
            items: [],
            level: 18,
            summonerName: "Enemy 4",
            team: "ORDER"
        },
        {
            championName: "Lulu",
            items: [],
            level: 18,
            summonerName: "Enemy 5",
            team: "ORDER"
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