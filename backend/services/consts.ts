import { Acp, AllPropsCS } from "./interfaces";

const Penetration = (v: number, u: number): number => { return u * (1 + v); }

let m: string = "magicPenetrationPercent";
let a: string = "armorPenetrationPercent";

const Insert = (v: number, u: number): number => { return u += v; }

const f = (k: keyof AllPropsCS, v: number, u: Record<keyof AllPropsCS, number>) => {
    return u[k] = k == m || k == a ? Penetration(v, u[k]) : Insert(v, u[k]);
}

export const ToolKeyDependent: Record<string, (k: keyof AllPropsCS, v: number, u: Record<keyof AllPropsCS, number>) => void> = {
    "3135": (k, v, u) => f(k, v, u),
    "223135": (k, v, u) => f(k, v, u),
    "3137": (k, v, u) => f(k, v, u),
    "223137": (k, v, u) => f(k, v, u),
    "4010": (k, v, u) => f(k, v, u),
    "4630": (k, v, u) => f(k, v, u),
    "3303": (k, v, u) => f(k, v, u),
    "223303": (k, v, u) => f(k, v, u),
    "3035": (k, v, u) => f(k, v, u),
    "3036": (k, v, u) => f(k, v, u),
    "223036": (k, v, u) => f(k, v, u),
    "3302": (k, v, u) => f(k, v, u),
    "223302": (k, v, u) => f(k, v, u),
    "4015": (k, v, u) => f(k, v, u),
    "6694": (k, v, u) => f(k, v, u),
    "226694": (k, v, u) => f(k, v, u)
}

export const ToolKeyless: Record<string, (g: Acp) => void> = {
    "4637": (g) => { g.championStats.abilityPower += 0.02 * (g.bonusStats.maxHealth + g.championStats.maxHealth); },
    "4633": (g) => { g.championStats.abilityPower += 0.02 * (g.bonusStats.maxHealth + g.championStats.maxHealth); },
    "3040": (g) => { g.championStats.abilityPower += 0.02 * Number(g.bonusStats.resourceMax); },
    "3003": (g) => { g.championStats.abilityPower += 0.01 * Number(g.bonusStats.resourceMax); },
    "3119": (g) => { g.championStats.maxHealth += 0.15 * (Number(g.bonusStats.resourceMax) + 500); },
    "3121": (g) => { g.championStats.maxHealth += 0.15 * (Number(g.bonusStats.resourceMax) + 860); },
    "3042": (g) => { g.championStats.attackDamage += 0.025 * g.championStats.resourceMax; },
    "3004": (g) => { g.championStats.attackDamage += 0.025 * g.championStats.resourceMax; },
    "2501": (g) => { g.championStats.attackDamage += 0.025 * (g.bonusStats.maxHealth + 500); },
}