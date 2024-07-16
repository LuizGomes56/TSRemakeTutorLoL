export interface Image {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Info {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
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

export interface Champion {
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

export interface RequestChampion {
    type: string;
    format: string;
    version: string;
    data: Record<string, Champion>;
}

export interface LocalChampionProps {
    type: string;
    area: boolean;
    min: string[];
    max: string[];
}

interface ChampionFile {
    A?: LocalChampionProps;
    C?: LocalChampionProps;
    P?: LocalChampionProps;
    Q?: LocalChampionProps;
    W?: LocalChampionProps;
    E?: LocalChampionProps;
    R?: LocalChampionProps;
}

export interface ChampionData {
    [key: string]: ChampionFile;
}