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
    runes: string[];
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
}