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
        Passive: {}
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