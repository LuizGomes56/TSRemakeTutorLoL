export interface RuneAPIProps {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
}

interface Slot {
    runes: RuneAPIProps[];
}

interface RunePath {
    id: number;
    key: string;
    icon: string;
    name: string;
    slots: Slot[];
}

export type RequestRunes = RunePath[];

export interface Rune {
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

interface RuneData {
    [key: string]: Rune;
}

export interface LocalRunes {
    type: string;
    version: string;
    data: RuneData;
}