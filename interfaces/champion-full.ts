interface ImageProps {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface PassiveProps {
    name: string;
    description: string;
    image: ImageProps;
}

interface LevelTipProps {
    label: string[];
    effect: string[];
}

interface SpellProps {
    id: string;
    name: string;
    description: string;
    tooltip: string;
    leveltip: LevelTipProps;
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
    image: ImageProps;
    resource: string;
}

interface SkinProps {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
}

interface StatsProps {
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

export interface ChampionFull {
    name: string;
    id: string;
    stats: StatsProps;
    passive: PassiveProps;
    spells: SpellProps[];
    skins: SkinProps[];
}