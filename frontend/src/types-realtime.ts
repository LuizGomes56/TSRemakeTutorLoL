import { CalculatorProps } from "./types-calculator";

export interface RequestBody {
    code: string;
    item: string;
    rec: boolean;
}

export interface Response {
    success: boolean;
    message?: string;
    data: {
        champion_name: string;
        created_at: string;
        game: string;
        game_code: string;
        game_id: string;
        summoner_name: string;
    }
}

export interface CoreStats {
    maxHealth: number;
    armor: number;
    magicResist: number;
    attackDamage: number;
    resourceMax: number | null;
    abilityPower: number;
}

interface Image {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Passive {
    name: string;
    description: string;
    image: Image;
}

interface Stats {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
}

export interface TargetChampion {
    id: string;
    name: string;
    stats: Stats;
    spells: {
        id: string;
        name: string;
        description: string;
        cooldown: number[];
    }[];
    passive: Passive;
}

interface DefAbility {
    abilityLevel?: number;
    displayName?: string;
    id?: string;
    rawDescription?: string;
    rawDisplayName?: string;
}

interface ChampionStats {
    abilityHaste?: number;
    abilityPower: number;
    armor: number;
    armorPenetrationFlat?: number;
    armorPenetrationPercent: number;
    attackDamage: number;
    attackRange: number;
    attackSpeed: number;
    bonusArmorPenetrationPercent?: number;
    bonusMagicPenetrationPercent?: number;
    critChance: number;
    critDamage: number;
    currentHealth: number;
    healShieldPower?: number;
    healthRegenRate?: number;
    lifeSteal?: number;
    magicLethality?: number;
    magicPenetrationFlat: number;
    magicPenetrationPercent: number;
    magicResist: number;
    maxHealth: number;
    moveSpeed?: number;
    omnivamp?: number;
    physicalLethality: number;
    physicalVamp?: number;
    resourceMax: number;
    resourceRegenRate?: number;
    resourceType?: string;
    resourceValue?: number;
    spellVamp?: number;
    tenacity?: number;
}

interface DefRune {
    displayName?: string;
    id: number;
    rawDescription?: string;
    rawDisplayName?: string;
}

interface FullRunes {
    generalRunes: DefRune[];
    keystone?: DefRune;
    primaryRuneTree?: DefRune;
    secondaryRuneTree?: DefRune;
    statRunes?: {
        id: number;
        rawDescription: string;
    }[];
}

interface DefItem {
    canUse?: boolean;
    consumable?: boolean;
    count?: number;
    displayName?: string;
    itemID: number;
    price?: number;
    rawDescription?: string;
    rawDisplayName?: string;
    slot?: number;
}

interface SummonerSpell {
    displayName?: string;
    rawDescription: string;
    rawDisplayName?: string;
}

interface SummonerSpells {
    summonerSpellOne: SummonerSpell;
    summonerSpellTwo: SummonerSpell;
}

interface Scores {
    assists: number;
    creepScore?: number;
    deaths: number;
    kills: number;
    wardScore?: number;
}

interface PlayerRunes {
    keystone?: DefRune;
    primaryRuneTree?: DefRune;
    secondaryRuneTree?: DefRune;
}

export interface Player {
    championName: string;
    isBot?: boolean;
    isDead?: boolean;
    items: DefItem[];
    level: number;
    position: string;
    rawChampionName?: string;
    rawSkinName?: string;
    respawnTimer?: number;
    runes?: PlayerRunes;
    scores: Scores;
    skinID: number;
    skinName?: string;
    summonerName: string;
    summonerSpells: SummonerSpells;
    team: string;
}

export interface Event {
    EventID?: number;
    EventName?: string;
    EventTime?: number;
    Assisters?: string[];
    KillerName?: string;
    VictimName?: string;
    DragonType?: string;
    Stolen?: string;
    Recipient?: string;
    Acer?: string;
    AcingTeam?: string;
}

interface GameEvents {
    Events: Event[];
}

interface GameData {
    gameMode?: string;
    gameTime: number;
    mapName?: string;
    mapNumber: number;
    mapTerrain?: string;
}

interface DefAbilities {
    E: DefAbility;
    Passive?: DefAbility;
    Q: DefAbility;
    R: DefAbility;
    W: DefAbility;
}

interface ActivePlayer {
    abilities: DefAbilities;
    championStats: ChampionStats;
    currentGold?: number;
    fullRunes: FullRunes;
    level: number;
    summonerName: string;
    teamRelativeColors?: boolean;
}

export interface GameProps {
    activePlayer: ActivePlayer;
    allPlayers: Player[];
    events: GameEvents;
    gameData: GameData;
}

export interface DragonProps {
    earth: number;
    fire: number;
    chemtech: number;
}

export interface Damage {
    min: number;
    max?: number | null;
    type: string;
    name?: string;
    area?: boolean;
    onhit?: boolean;
}

export interface ToolProps {
    dif?: Damages;
    max: Damages;
    sum: number;
    rec?: Record<string, number>;
}

export interface Tag {
    id: string;
    key: "abilities" | "runes" | "items" | "spell";
    img: string;
    mod: "min" | "max";
    text: string[];
}

export interface RelevantProps {
    min: string[];
    max: string[];
};

export type RequiredProps = {
    abilities: RelevantProps;
    items: RelevantProps;
    runes: RelevantProps;
    spell: RelevantProps;
    champion: DataProps["activePlayer"]["champion"];
}

export type PropertyProps = RequiredProps & {
    enemies: Ply[] | CalculatorProps["allPlayers"];
    checked: boolean[];
}

export type Tip = {
    s: string;
    n?: string;
    d?: string;
    r?: number[];
};

export type ToolInfo = {
    id: string;
    name: string | undefined;
    active: boolean;
    gold: number | undefined;
    raw: any;
}

interface ExtendsActivePlayer {
    championName: string;
    champion: TargetChampion;
    dragon: DragonProps;
    items: string[];
    baseStats: CoreStats;
    bonusStats: CoreStats;
    team: string;
    skin: number;
    tool: ToolInfo
    relevant: {
        abilities: RelevantProps;
        items: RelevantProps;
        runes: RelevantProps;
        spell: RelevantProps;
    };
}

export interface Damages {
    abilities: Record<string, Damage> | {};
    items: Record<string, Damage> | {};
    runes: Record<string, Damage> | {};
    spell: Record<string, Damage> | {};
}

interface ExtendsPlayer {
    champion: TargetChampion;
    dragon: DragonProps;
    bonusStats: CoreStats;
    baseStats: CoreStats;
    championStats: CoreStats;
    damage: Damages;
    tool?: ToolProps;
}

type Acp = ActivePlayer & ExtendsActivePlayer;
export type Ply = Player & ExtendsPlayer;

export interface DataProps extends GameProps {
    activePlayer: Acp;
    allPlayers: Array<Ply>;
}

export interface EvalItemStats {
    name: string;
    stats: {
        mod: AllPropsCS;
        raw: any;
    };
    stack: boolean;
    from: string[];
    gold: Gold;
    maps: Record<string, boolean>;
}

type AllPropsCS = CoreStats & {
    currentHealth: number;
    attackSpeed: number;
    attackRange: number;
    critChance: number;
    critDamage: number;
    physicalLethality: number;
    armorPenetrationPercent: number;
    magicPenetrationPercent: number;
    magicPenetrationFlat: number;
}

interface Gold {
    base: number;
    total: number;
    sell: number;
    purchasable: boolean;
}