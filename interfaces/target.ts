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

export interface AbilityProps {
    min: number;
    max: number | null;
    type: string;
    area?: boolean;
}

export interface AttackProps {
    min: number;
    max: number | null;
    type: string;
    area: boolean;
}

export interface ItemProps {
    min: number;
    max: number | null;
    type: string;
    name: string;
    area?: boolean;
    onhit?: number;
}

export interface RuneProps {
    min: number;
    max: number | null;
    type: string;
    name: string;
    area?: boolean;
}

export interface Abilities {
    Q: AbilityProps;
    W: AbilityProps;
    E: AbilityProps;
    R: AbilityProps;
    P: AbilityProps;
}

export interface Attacks {
    A: AttackProps;
    C: AttackProps;
}

export interface Items {
    I: ItemProps;
    T: Record<string, ItemProps>;
}

export interface Runes {
    K: Record<string, RuneProps>;
}

export interface InfoProps {
    id: string;
    name: string;
    gold: number;
    value: number;
}

type ToolSection = Abilities & Attacks & Items & Runes;

export interface ToolProps {
    info: InfoProps;
    provide: ToolSection;
    result: ToolSection;
}

export interface DataProps extends GameProps {
    activePlayer: ActivePlayer & {
        championName: string;
        champion: Champion;
        dragon: DragonProps;
        items: string[];
        baseStats: StatProps;
        bonusStats: StatProps;
        team: string;
        relevant: {
            abilities: {
                min: string[];
                max: string[];
            };
            items: string[];
            runes: string[];
        };
    };
    allPlayers: Array<Player & {
        champion: Champion;
        dragon: DragonProps;
        bonusStats: StatProps;
        baseStats: StatProps;
        championStats: StatProps;
        damage: {
            abilities: {
                P?: AbilityProps;
                Q?: AbilityProps;
                W?: AbilityProps;
                E?: AbilityProps;
                R?: AbilityProps;
                A: AttackProps;
                C: AttackProps;
            };
            items: Record<string, ItemProps>;
            runes: Record<string, RuneProps>;
            tool: {
                A: ToolProps;
                B: ToolProps;
            };
        };
    }>;
}