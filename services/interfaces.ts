export interface CoreStats {
    maxHealth: number;
    armor: number;
    magicResist: number;
    attackDamage: number;
    resourceMax: number | null;
    abilityPower: number;
}

interface Multiplier {
    magic: number;
    physical: number;
    general: number;
}

export type AllPropsCS = CoreStats & {
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

export interface AllStatsProps {
    activePlayer: {
        id: string;
        level: number;
        form: "melee" | "ranged";
        multiplier: Multiplier;
        adaptative: {
            type: "physical" | "magic";
            ratio: number;
        }
        championStats: AllPropsCS;
        baseStats: CoreStats;
        bonusStats: CoreStats;
    }
    player: {
        multiplier: Multiplier;
        realStats: {
            armor: number;
            magicResist: number;
        }
        championStats: CoreStats;
        baseStats: CoreStats;
        bonusStats: CoreStats;
    }
    property: {
        overHealth: number;
        missingHealth: number;
        excessHealth: number;
        steelcaps: number;
        rocksolid: number;
        randuin: number;
    }
}

export interface ReplacementsProps {
    steelcapsEffect: number;
    attackReductionEffect: number;
    exceededHP: number;
    missingHP: number;
    magicMod: number;
    physicalMod: number;
    level: number;
    currentAP: number;
    currentAD: number;
    currentLethality: number;
    maxHP: number;
    maxMana: number;
    currentMR: number;
    currentArmor: number;
    currentHealth: number;
    basicAttack: number;
    attackSpeed: number;
    critChance: number;
    critDamage: number;
    adaptative: number;
    baseHP: number;
    baseMana: number | null;
    baseArmor: number;
    baseMR: number;
    baseAD: number;
    bonusAD: number;
    bonusHP: number;
    bonusArmor: number;
    bonusMR: number;
    expectedHealth: number;
    expectedMana: number | null;
    expectedArmor: number;
    expectedMR: number;
    expectedAD: number;
    expectedBonusHealth: number;
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

interface LevelTip {
    label: string[];
    effect: string[];
}

interface Spell {
    id: string;
    name: string;
    description: string;
    tooltip: string;
    leveltip: LevelTip;
    maxrank: number;
    cooldown: number[];
    cooldownBurn: string;
    cost: number[];
    costBurn: string;
    datavalues: Record<string, unknown>;
    effect: Array<number[] | null>;
    effectBurn: (string | null)[];
    vars: unknown[];
    costType: string;
    maxammo: string;
    range: number[];
    rangeBurn: string;
    image: Image;
    resource: string;
}

interface Skin {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
}

export interface Stats {
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

export interface Champions {
    version: string;
    format: string;
    type: string;
    data: Record<string, Champion>;
}

interface Info {
    attack: number,
    defense: number,
    magic: number,
    difficulty: number
}

interface Champion {
    id: string;
    key: string;
    name: string;
    title: string;
    image: Image;
    skins: Skin[];
    lore: string;
    blurb: string;
    allytips: string[];
    enemytips: string[];
    tags: string[];
    partype: string;
    info: Info;
    stats: Stats;
    spells: Spell[];
    passive: Passive;
    recommended: unknown[];
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

interface Ability {
    type: string;
    area: boolean;
    min: string[];
    max: string[];
}

export interface LocalChampion {
    [key: string]: Record<string, Ability>;
}

interface DefAbility {
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

export interface SummonerSpells {
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

export interface Player {
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

interface GameData {
    gameMode: string;
    gameTime: number;
    mapName: string;
    mapNumber: number;
    mapTerrain: string;
}

export interface DefAbilities {
    E: DefAbility;
    Passive: DefAbility;
    Q: DefAbility;
    R: DefAbility;
    W: DefAbility;
}

export interface ActivePlayer {
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

export interface Items {
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

export interface TargetItem {
    name: string;
    description: string;
    gold: Gold;
    maps: Record<string, boolean>;
    stats: ItemStats;
    from?: string[];
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

interface Gold {
    base: number;
    total: number;
    sell: number;
    purchasable: boolean;
}

export interface ItemProps {
    name: string;
    type: string;
    min: {
        melee: string;
        ranged: string;
    },
    max?: {
        melee: string;
        ranged: string;
    };
    onhit?: boolean
    effect?: number[]
}

interface LocalItem {
    [key: string]: ItemProps;
}

export interface LocalItems {
    type: string;
    version: string;
    data: LocalItem;
}

interface Rune {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
}

interface Slot {
    runes: Rune[];
}

interface Runes {
    id: number;
    key: string;
    icon: string;
    name: string;
    slots: Slot[];
}[]

interface RuneDamage {
    name: string;
    type: string;
    min: {
        melee: string;
        ranged: string;
    };
    max?: {
        melee: string;
        ranged: string;
    };
}

interface LocalRune {
    [key: string]: RuneDamage;
}

export interface LocalRunes {
    type: string;
    version: string;
    data: LocalRune;
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

export interface ToolCalc {
    abilities: Record<string, Damage>;
    items: Record<string, Damage> | {};
    runes: Record<string, Damage> | {};
    spell: Record<string, Damage> | {};
}

interface ToolProps {
    dif?: ToolCalc;
    max: ToolCalc;
}

export interface AbilityFilter {
    min: string[];
    max: string[];
};

interface ExtendsActivePlayer {
    championName: string;
    champion: TargetChampion;
    dragon: DragonProps;
    items: string[];
    baseStats: CoreStats;
    bonusStats: CoreStats;
    team: string;
    skin: number;
    relevant: {
        abilities: AbilityFilter;
        items: string[];
        runes: string[];
        spell: string[];
    };
}

interface ExtendsPlayer {
    champion: TargetChampion;
    dragon: DragonProps;
    bonusStats: CoreStats;
    baseStats: CoreStats;
    championStats: CoreStats;
    damage: {
        abilities: Record<string, Damage>;
        items: Record<string, Damage> | {};
        runes: Record<string, Damage> | {};
        spell: Record<string, Damage> | {};
    };
    tool?: ToolProps;
}

export type Acp = ActivePlayer & ExtendsActivePlayer;
export type Ply = Player & ExtendsPlayer;

export interface DataProps extends GameProps {
    activePlayer: Acp;
    allPlayers: Array<Ply>;
}

export interface ChampionIDs {
    [key: string]: {
        en_US: string;
        cs_CZ: string;
        de_DE: string;
        el_GR: string;
        en_AU: string;
        en_GB: string;
        en_PH: string;
        en_SG: string;
        es_AR: string;
        es_ES: string;
        es_MX: string;
        fr_FR: string;
        hu_HU: string;
        it_IT: string;
        ja_JP: string;
        ko_KR: string;
        pl_PL: string;
        pt_BR: string;
        ro_RO: string;
        ru_RU: string;
        th_TH: string;
        tr_TR: string;
        vi_VN: string;
        zh_CN: string;
        zh_MY: string;
        zh_TW: string;
    };
}

export interface KeyReplaces {
    percentages: string[];
    keys: Record<string, string>;
    extras: Record<string, Record<keyof ChampionStats, number>>;
}

export interface EvalItemStats {
    name: string;
    stats: AllPropsCS;
    stack: boolean;
    from: string[];
    gold: Gold;
}

export interface FullChampions {
    type: string;
    format: string;
    version: string;
    data: Record<string, FullChamp>;
}

interface FullChamp {
    version: string;
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    info: Info;
    image: Image;
    tags: string[];
    partype: string;
    stats: Stats;
}