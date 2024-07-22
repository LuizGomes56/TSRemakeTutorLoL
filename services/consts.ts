import { Acp, AllPropsCS } from "./interfaces";

export const ToolKeyDependent: Record<string, (k: keyof AllPropsCS, v: number, u: number) => void> = {
    "3089": (k, v, u) => k == "abilityPower" ? u = 1.35 * (u + v) : u += v,
    "3031": (k, v, u) => { if (k == "critDamage") { u += 40 + v } },
    "223031": (k, v, u) => { if (k == "critDamage") { u += 40 + v } },
    "6694": (k, v, u) => { if (k == "physicalLethality") { u -= 25 + 0.11 * (u + v); } },
}

export const ToolKeyless: Record<string, (g: Acp) => void> = {
    "4637": (g) => {
        g.championStats.abilityPower += 0.02 * (g.bonusStats.maxHealth + g.championStats.maxHealth);
    },
    "4633": (g) => {
        g.championStats.abilityPower += 0.02 * (g.bonusStats.maxHealth + g.championStats.maxHealth);
    },
    "3040": (g) => {
        g.championStats.abilityPower += 0.02 * Number(g.bonusStats.resourceMax);
    },
    "3003": (g) => {
        g.championStats.abilityPower += 0.01 * Number(g.bonusStats.resourceMax);
    },
    "3119": (g) => {
        g.championStats.maxHealth += 0.15 * (Number(g.bonusStats.resourceMax) + 500);
    },
    "3121": (g) => {
        g.championStats.maxHealth += 0.15 * (Number(g.bonusStats.resourceMax) + 860);
    },
    "3042": (g) => {
        g.championStats.attackDamage += 0.025 * g.championStats.resourceMax;
    },
    "3004": (g) => {
        g.championStats.attackDamage += 0.025 * g.championStats.resourceMax;
    },
    "3089": (g) => {
        g.championStats.abilityPower += 1.35 * 140;
    },
    "223089": (g) => {
        g.championStats.abilityPower += 1.35 * 70;
    },
    "228002": (g) => {
        g.championStats.abilityPower += 1.5 * 300;
    }
}