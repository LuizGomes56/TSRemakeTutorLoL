import { Acp, AllPropsCS } from "./interfaces";

const Penetration = (v: number, u: number): number => { return u * (1 + v); }

let m: string = "magicPenetrationPercent";
let a: string = "armorPenetrationPercent";

const Insert = (v: number, u: number): number => { return u += v; }

export const ToolKeyDependent: Record<string, (k: keyof AllPropsCS, v: number, u: Record<keyof AllPropsCS, number>) => void> = {
    "3135": (k, v, u) => { u[k] = k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "223135": (k, v, u) => { u[k] = k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "3137": (k, v, u) => { u[k] = k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "223137": (k, v, u) => { u[k] = k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "4010": (k, v, u) => { u[k] = k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "4630": (k, v, u) => { u[k] = k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "3303": (k, v, u) => { u[k] = k == a ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "223303": (k, v, u) => { u[k] = k == a ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "3035": (k, v, u) => { u[k] = k == a ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "3036": (k, v, u) => { u[k] = k == a ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "223036": (k, v, u) => { u[k] = k == a ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "3302": (k, v, u) => { u[k] = k == a || k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "223302": (k, v, u) => { u[k] = k == a || k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "4015": (k, v, u) => { u[k] = k == a || k == m ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "6694": (k, v, u) => { u[k] = k == a ? Penetration(v, u[k]) : Insert(v, u[k]) },
    "226694": (k, v, u) => { u[k] = k == a ? Penetration(v + 3, u[k]) : Insert(v, u[k]) }
}

export const ToolKeyless: Record<string, (g: Acp) => void> = {
    // "3031": (k, v, u) => { if (k == "critDamage") { u[k] += 40 + v } },
    // "223031": (k, v, u) => { if (k == "critDamage") { u[k] += 40 + v } },
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

let r: number = 1.35;

// export const ToolKeySpecial: Record<string, (g: ChampionStats, w: string[], v: number) => void> = {
//     "3089": (g, w, v) => {
//         if (w.includes("3089")) { g.abilityPower += r * v; }
//         else { g.abilityPower = r * (g.abilityPower + v) }
//     },
//     "223089": (g, w, v) => {
//         if (w.includes("223089")) { g.abilityPower += r * v; }
//         else { g.abilityPower = r * (g.abilityPower + v) }
//     },
//     "8002": (g, w, v) => {
//         if (w.includes("3089")) { g.abilityPower += r * v; }
//         else { g.abilityPower = 1.5 * (g.abilityPower + v) }
//     }
// }