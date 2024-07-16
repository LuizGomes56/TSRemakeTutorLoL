import { ActivePlayer, Player, GameProps } from "./default";
import { Champion } from "./champion";

export interface DragonProps {
    earth: number;
    fire: number;
    chemtech: number;
}

export interface StatProps {
    maxHealth: number;
    armor: number;
    magicResist: number;
    attackDamage: number;
    resourceMax: number | null;
    abilityPower: number;
}

export interface LocalAbilityProps {
    min: number;
    max: number | null;
    type: string;
    area?: boolean;
}

export interface ItemProps {
    min: number;
    max: number | null;
    type: string;
    name: string;
    onhit?: boolean;
}

export interface RuneProps {
    min: number;
    type: string;
    name: string;
}

export interface Abilities {
    A: LocalAbilityProps;
    C: LocalAbilityProps;
    Q: LocalAbilityProps;
    W: LocalAbilityProps;
    E: LocalAbilityProps;
    R: LocalAbilityProps;
    P: LocalAbilityProps;
}

interface Items {
    I: ItemProps;
    T: Record<string, ItemProps>;
}

interface Runes {
    K: Record<string, RuneProps>;
}

export interface InfoProps {
    id: string;
    name: string;
    gold: number;
    value: number;
}

type ToolSection = Abilities & Items & Runes;

export interface ToolProps {
    info: InfoProps;
    provide: ToolSection;
    result: ToolSection;
}

export interface AbilityFilter {
    min: string[];
    max: string[];
};

export interface SpellProps {
    name: string;
    type: string;
    min: number;
    max?: number;
}

export interface ExtendsPlayer {
    champion: Champion;
    dragon: DragonProps;
    bonusStats: StatProps;
    baseStats: StatProps;
    championStats: StatProps;
    damage: {
        abilities: Abilities;
        items: Record<string, ItemProps> | {};
        runes: Record<string, RuneProps> | {};
        spell: Record<string, SpellProps> | {};
        tool?: {
            A: ToolProps;
            B: ToolProps;
        };
    };
}

export interface ExtendsActivePlayer {
    championName: string;
    champion: Champion;
    dragon: DragonProps;
    items: string[];
    baseStats: StatProps;
    bonusStats: StatProps;
    team: string;
    skin: number;
    relevant: {
        abilities: AbilityFilter;
        items: string[];
        runes: string[];
        spell: string[];
    };
}
export interface DataProps extends GameProps {
    activePlayer: ActivePlayer & ExtendsActivePlayer;
    allPlayers: Array<Player & ExtendsPlayer>;
}