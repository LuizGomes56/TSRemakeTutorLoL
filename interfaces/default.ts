export interface AbilityProps {
    abilityLevel?: number;
    displayName: string;
    id: string;
    rawDescription: string;
    rawDisplayName: string;
}

export interface ChampionStats {
    abilityHaste: number;
    abilityPower: number;
    armor: number;
    armorPenetrationFlat: number;
    armorPenetrationPercent: number;
    attackDamage: number;
    attackRange: number;
    attackSpeed: number;
    bonusArmorPenetrationPercent: number;
    bonusMagicPenetrationPercent: number;
    critChance: number;
    critDamage: number;
    currentHealth: number;
    healShieldPower: number;
    healthRegenRate: number;
    lifeSteal: number;
    magicLethality: number;
    magicPenetrationFlat: number;
    magicPenetrationPercent: number;
    magicResist: number;
    maxHealth: number;
    moveSpeed: number;
    omnivamp: number;
    physicalLethality: number;
    physicalVamp: number;
    resourceMax: number;
    resourceRegenRate: number;
    resourceType: string;
    resourceValue: number;
    spellVamp: number;
    tenacity: number;
}

export interface Rune {
    displayName: string;
    id: number;
    rawDescription: string;
    rawDisplayName: string;
}

export interface FullRunes {
    generalRunes: Rune[];
    keystone: Rune;
    primaryRuneTree: Rune;
    secondaryRuneTree: Rune;
    statRunes: {
        id: number;
        rawDescription: string;
    }[];
}

export interface Item {
    canUse: boolean;
    consumable: boolean;
    count: number;
    displayName: string;
    itemID: number;
    price: number;
    rawDescription: string;
    rawDisplayName: string;
    slot: number;
}

export interface SummonerSpell {
    displayName: string;
    rawDescription: string;
    rawDisplayName: string;
}

export interface SummonerSpells {
    summonerSpellOne: SummonerSpell;
    summonerSpellTwo: SummonerSpell;
}

export interface Scores {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
}

export interface PlayerRunes {
    keystone: Rune;
    primaryRuneTree: Rune;
    secondaryRuneTree: Rune;
}

export interface Player {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    items: Item[];
    level: number;
    position: string;
    rawChampionName: string;
    rawSkinName: string;
    respawnTimer: number;
    runes: PlayerRunes;
    scores: Scores;
    skinID: number;
    skinName: string;
    summonerName: string;
    summonerSpells: SummonerSpells;
    team: string;
}

export interface Event {
    EventID: number;
    EventName: string;
    EventTime: number;
    Assisters?: string[];
    KillerName?: string;
    VictimName?: string;
    DragonType?: string;
    Stolen?: string;
    Recipient?: string;
    Acer?: string;
    AcingTeam?: string;
}

export interface GameEvents {
    Events: Event[];
}

export interface GameData {
    gameMode: string;
    gameTime: number;
    mapName: string;
    mapNumber: number;
    mapTerrain: string;
}

export interface ActivePlayer {
    abilities: {
        E: AbilityProps;
        Passive: AbilityProps;
        Q: AbilityProps;
        R: AbilityProps;
        W: AbilityProps;
    };
    championStats: ChampionStats;
    currentGold: number;
    fullRunes: FullRunes;
    level: number;
    summonerName: string;
    teamRelativeColors: boolean;
}

export interface GameProps {
    activePlayer: ActivePlayer;
    allPlayers: Player[];
    events: GameEvents;
    gameData: GameData;
}
