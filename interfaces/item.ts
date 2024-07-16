import { Image } from "./champion";

export interface RequestItem {
    type: string;
    version: string;
    basic: any;
    data: Record<string, ItemAPIProps>;
    groups: any[];
    tree: any[]
}

export interface ItemAPIProps {
    name: string;
    description: string;
    colloq: string;
    into: string[];
    image: Image;
    gold: GoldProps;
    tags: string[];
    maps: Record<string, boolean>;
    stats: ItemStatsProps;
}

export interface ItemStatsProps {
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

interface GoldProps {
    base: number;
    total: number;
    sell: number;
    purchasable: boolean;
}

export interface ItemFile {
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

interface ItemData {
    [key: string]: ItemFile;
}

export interface LocalItems {
    type: string;
    version: string;
    data: ItemData;
}
