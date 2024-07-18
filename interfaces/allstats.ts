import { StatProps } from "./target";

export interface AllStatProps {
    activePlayer: {
        id: string;
        level: number;
        form: "melee" | "ranged";
        multiplier: {
            magic: number;
            physical: number;
            general: number;
        }
        adaptative: {
            type: "physical" | "magic";
            ratio: number;
        }
        championStats: {
            abilityPower: number;
            magicResist: number;
            armor: number;
            attackDamage: number;
            resourceMax: number;
            maxHealth: number;
            currentHealth: number;
            attackSpeed: number;
            attackRange: number;
            critChance: number;
            critDamage: number;
            armorPenetrationFlat: number;
            armorPenetrationPercent: number;
            magicPenetrationPercent: number;
            magicPenetrationFlat: number;
        }
        baseStats: StatProps;
        bonusStats: StatProps;
    }
    player: {
        multiplier: {
            physical: number;
            magic: number;
            general: number;
        };
        realStats: {
            armor: number;
            magicResist: number;
        }
        championStats: StatProps;
        baseStats: StatProps;
        bonusStats: StatProps;
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

export interface ReplacementProps {
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