export interface RequestBody {
    code: string;
    item: string;
}

export interface Response {
    sucess: boolean;
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

interface CoreStats {
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

interface TargetChampion {
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
    displayName: string;
    id: string;
    rawDescription: string;
    rawDisplayName: string;
}

interface ChampionStats {
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

interface DefRune {
    displayName: string;
    id: number;
    rawDescription: string;
    rawDisplayName: string;
}

interface FullRunes {
    generalRunes: DefRune[];
    keystone: DefRune;
    primaryRuneTree: DefRune;
    secondaryRuneTree: DefRune;
    statRunes: {
        id: number;
        rawDescription: string;
    }[];
}

interface DefItem {
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

interface SummonerSpell {
    displayName: string;
    rawDescription: string;
    rawDisplayName: string;
}

interface SummonerSpells {
    summonerSpellOne: SummonerSpell;
    summonerSpellTwo: SummonerSpell;
}

interface Scores {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
}

interface PlayerRunes {
    keystone: DefRune;
    primaryRuneTree: DefRune;
    secondaryRuneTree: DefRune;
}

interface Player {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    items: DefItem[];
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

interface Event {
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

interface GameEvents {
    Events: Event[];
}

interface GameData {
    gameMode: string;
    gameTime: number;
    mapName: string;
    mapNumber: number;
    mapTerrain: string;
}

interface DefAbilities {
    E: DefAbility;
    Passive: DefAbility;
    Q: DefAbility;
    R: DefAbility;
    W: DefAbility;
}

interface ActivePlayer {
    abilities: DefAbilities;
    championStats: ChampionStats;
    currentGold: number;
    fullRunes: FullRunes;
    level: number;
    summonerName: string;
    teamRelativeColors: boolean;
}

interface GameProps {
    activePlayer: ActivePlayer;
    allPlayers: Player[];
    events: GameEvents;
    gameData: GameData;
}

interface DragonProps {
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

interface ToolProps {
    dif?: Damages;
    max: Damages;
    sum: number;
}

interface AbilityFilter {
    min: string[];
    max: string[];
};

type Relevant = DataProps["activePlayer"]["relevant"];

export type PropertyProps = {
    abilities: Relevant["abilities"];
    items: Relevant["items"];
    runes: Relevant["runes"];
    spell: Relevant["spell"];
    champion: DataProps["activePlayer"]["champion"];
    enemies: DataProps["allPlayers"];
}

export type Tip = {
    s: string;
    n?: string;
    d?: string;
    r?: number[];
} | null;

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
        abilities: AbilityFilter;
        items: string[];
        runes: string[];
        spell: string[];
    };
}

interface Damages {
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
type Ply = Player & ExtendsPlayer;

export interface DataProps extends GameProps {
    activePlayer: Acp;
    allPlayers: Array<Ply>;
}

export interface ItemProps {
    type: string;
    version: string;
    basic: any;
    data: Record<string, Item>;
    groups: any[];
    tree: any[]
}

interface Item {
    name: string;
    description: string;
    colloq: string;
    into?: string[];
    image: Image;
    group?: string;
    gold: Gold;
    tags: string[];
    maps: Record<string, boolean>;
    stats: ItemStats;
    hideFromAll?: boolean;
    inStore?: boolean;
    consumed?: boolean;
    stacks?: boolean;
    plaintext?: string;
    requiredAlly?: string;
    requiredChampion?: string;
    specialRecipe?: number;
    consumeOnFull?: boolean;
    from?: string[];
    effect?: Record<string, string>;
}

interface Gold {
    base: number;
    total: number;
    sell: number;
    purchasable: boolean;
}

interface ItemStats {
    FlatHPPoolMod?: number,
    rFlatHPModPerLevel?: number,
    FlatMPPoolMod?: number,
    rFlatMPModPerLevel?: number,
    PercentHPPoolMod?: number,
    PercentMPPoolMod?: number,
    FlatHPRegenMod?: number,
    rFlatHPRegenModPerLevel?: number,
    PercentHPRegenMod?: number,
    FlatMPRegenMod?: number,
    rFlatMPRegenModPerLevel?: number,
    PercentMPRegenMod?: number,
    FlatArmorMod?: number,
    rFlatArmorModPerLevel?: number,
    PercentArmorMod?: number,
    rFlatArmorPenetrationMod?: number,
    rFlatArmorPenetrationModPerLevel?: number,
    rPercentArmorPenetrationMod?: number,
    rPercentArmorPenetrationModPerLevel?: number,
    FlatPhysicalDamageMod?: number,
    rFlatPhysicalDamageModPerLevel?: number,
    PercentPhysicalDamageMod?: number,
    FlatMagicDamageMod?: number,
    rFlatMagicDamageModPerLevel?: number,
    PercentMagicDamageMod?: number,
    FlatMovementSpeedMod?: number,
    rFlatMovementSpeedModPerLevel?: number,
    PercentMovementSpeedMod?: number,
    rPercentMovementSpeedModPerLevel?: number,
    FlatAttackSpeedMod?: number,
    PercentAttackSpeedMod?: number,
    rPercentAttackSpeedModPerLevel?: number,
    rFlatDodgeMod?: number,
    rFlatDodgeModPerLevel?: number,
    PercentDodgeMod?: number,
    FlatCritChanceMod?: number,
    rFlatCritChanceModPerLevel?: number,
    PercentCritChanceMod?: number,
    FlatCritDamageMod?: number,
    rFlatCritDamageModPerLevel?: number,
    PercentCritDamageMod?: number,
    FlatBlockMod?: number,
    PercentBlockMod?: number,
    FlatSpellBlockMod?: number,
    rFlatSpellBlockModPerLevel?: number,
    PercentSpellBlockMod?: number,
    FlatEXPBonus?: number,
    PercentEXPBonus?: number,
    rPercentCooldownMod?: number,
    rPercentCooldownModPerLevel?: number,
    rFlatTimeDeadMod?: number,
    rFlatTimeDeadModPerLevel?: number,
    rPercentTimeDeadMod?: number,
    rPercentTimeDeadModPerLevel?: number,
    rFlatGoldPer10Mod?: number,
    rFlatMagicPenetrationMod?: number,
    rFlatMagicPenetrationModPerLevel?: number,
    rPercentMagicPenetrationMod?: number,
    rPercentMagicPenetrationModPerLevel?: number,
    FlatEnergyRegenMod?: number,
    rFlatEnergyRegenModPerLevel?: number,
    FlatEnergyPoolMod?: number,
    rFlatEnergyModPerLevel?: number,
    PercentLifeStealMod?: number,
    PercentSpellVampMod?: number
}