interface ActivePlayer {
    abilities: {
        E: { abilityLevel: number },
        Q: { abilityLevel: number },
        R: { abilityLevel: number },
        W: { abilityLevel: number }
    }
    championStats: {
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
        resourceType: string;
    }
    level: number;
    summonerName: string;
}

interface AllPlayers {
    championName: string;
    items: string[];
    level: number;
    runes: string[];
    summonerName: string;
    team: "ORDER" | "CHAOS";
}[]

interface Dragons {
    ORDER: string[];
    CHAOS: string[];
}

type BrowserData = {
    activePlayer: ActivePlayer;
    allPlayers: AllPlayers;
    dragons: Dragons;
    mapNumber: number;
}