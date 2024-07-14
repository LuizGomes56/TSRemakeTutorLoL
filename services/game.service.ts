import { readFileSync, StatsBase } from "fs";
import { AbilityProps, ActivePlayer, ChampionStats, Event, GameEvents, GameProps } from "../interfaces/default"
import { AttackProps, DataProps, DragonProps, StatProps } from "../interfaces/target";
import { ChampionAPI } from "./lol.service";
import { platform } from "os";
import { Champion, Stats } from "../interfaces/champion";

const AssignChampion = async (g: DataProps): Promise<void> => {
    let k = g.activePlayer.summonerName
    let x = g.allPlayers;
    let y = x.find(player => player.summonerName === k);
    if (y) {
        g.activePlayer.team = y.team;
        await Promise.all(x.map(async (p, i) => {
            if (p.team !== y.team || p.summonerName === k) {
                let c = await ChampionAPI(p.championName);
                if (c) { x[i].champion = c; }
            }
        }));
    }
};

const Calculate = async (): Promise<DataProps> => {
    var g = JSON.parse(readFileSync(`${process.cwd()}/services/example.json`, "utf-8")) as DataProps    

    let activePlayer = g.activePlayer;
    let allPlayers = g.allPlayers;
    let events = g.events;
    let gameData = g.gameData;

    await AssignChampion(g);

    let all = allPlayers.map(p => ({ name: p.summonerName, team: p.team }));

    g.allPlayers.forEach(player => {
        player.dragon = Dragon(events, all, player.team);
        if (activePlayer.summonerName == player.summonerName) {
            activePlayer.championName = player.championName;

            let base = BaseStats(player.champion.stats, player.level);
            activePlayer.baseStats = base
            activePlayer.bonusStats = BonusStats(base, activePlayer.championStats);
            
            activePlayer.items = player.items.map(item => item.itemID.toString());
            // activePlayer.relevant = {
            //     abilities: FilterAbilities(),
            //     items: FilterItems(),
            //     runes: FilterRunes(),
            // }
        }
    })

    return g as DataProps
}

const Dragon = (event: GameEvents, all: { name: string, team: string }[], team: string): DragonProps => {
    let [earth, chemtech, fire] = [1, 1, 1];
    let x: Event[] = event.Events

    let fn: Record<string, () => void> = {
        Earth: () => earth += 0.05,
        Chemtech: () => chemtech += 0.06,
        Fire: () => fire += 0.03
    };

    x.forEach((e) => {
        if (e.DragonType && fn[e.DragonType]) {
            let x = e.KillerName
            let y = all.find(a => a.name === x)
            if (y) {
                console.log()
                let z = y.team
                if (z === team) {
                    fn[e.DragonType]();
                }
            }
        }
    })

    return {
        earth: earth,
        fire: fire,
        chemtech: chemtech
    }
}

const StatFormula = (a: number, b: number, c: number) => {
    return Math.round(a + b * (c - 1) * (0.7025 + 0.0175 * (c - 1)));
}

const BaseStats = (b: Stats, c: number): StatProps => {
    return {
        maxHealth: StatFormula(b.hp, b.hpperlevel, c),
        armor: StatFormula(b.armor, b.armorperlevel, c),
        magicResist: StatFormula(b.spellblock, b.spellblockperlevel, c),
        attackDamage: StatFormula(b.attackdamage, b.attackdamageperlevel, c),
        resourceMax: b.mp == 0 ? null : StatFormula(b.mp, b.mpperlevel, c),
        abilityPower: 0
    }
}

const BonusStats = (b: StatProps, c: ChampionStats): StatProps => {
    return {
        maxHealth: c.maxHealth - b.maxHealth,
        armor: c.armor - b.armor,
        magicResist: c.magicResist - b.magicResist,
        attackDamage: c.attackDamage - b.attackDamage,
        resourceMax: c.resourceMax !== null && b.resourceMax !== null ? c.resourceMax - b.resourceMax : null,
        abilityPower: c.abilityPower
    };
};

Calculate()

// const Abilities = (ability: string, activePlayer, allPlayers): AbilityProps | AttackProps => {
    
// }