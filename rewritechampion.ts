import * as fs from 'fs';
import * as path from 'path';

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

interface SpellDataOld {
    [key: string]: string[][];
}

interface TypeDataOld {
    [key: string]: string;
}

interface AoeDataOld {
    [key: string]: string;
}

interface VariationDataOld {
    [key: string]: string[][];
}

interface ChampionFileOld {
    spells: SpellDataOld;
    type: TypeDataOld;
    aoe: AoeDataOld;
    variation?: VariationDataOld;
}

interface ChampionDataOld {
    [key: string]: ChampionFileOld;
}

function adaptChampionFile(champion: ChampionFileOld): ChampionFile {
    const newChampion: any = {};

    const abilities = ["A", "C", "P", "Q", "W", "E", "R"];

    abilities.forEach(ability => {
        if (ability == "A" || "C" || "P" || "Q" || "W" || "E" || "R") {
            if (champion.spells[ability] && champion.type[ability] && champion.aoe[ability]) {
                newChampion[ability] = {
                    type: champion.type[ability],
                    area: champion.aoe[ability] === "true",
                    min: champion.spells[ability].map(spell => spell[0]),
                    max: champion.variation?.[ability]?.map(variation => variation[0]) || []
                };
            }
        }
    });

    return newChampion;
}

function adaptData(oldData: ChampionDataOld): ChampionData {
    const newData: ChampionData = {};

    for (const key in oldData) {
        if (Object.prototype.hasOwnProperty.call(oldData, key)) {
            newData[key] = adaptChampionFile(oldData[key]);
        }
    }

    return newData;
}

const championsDir = './champions';
const newChampionsDir = './newChampions';

if (!fs.existsSync(newChampionsDir)) {
    fs.mkdirSync(newChampionsDir);
}

fs.readdirSync(championsDir).forEach(file => {
    const filePath = path.join(championsDir, file);

    try {
        const oldData: ChampionDataOld = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newData: ChampionData = adaptData(oldData);

        const newFilePath = path.join(newChampionsDir, file);
        fs.writeFileSync(newFilePath, JSON.stringify(newData, null, 2), 'utf8');
        console.log(`Successfully processed: ${file}`);
    } catch (error) {
        console.error(`Failed to process: ${file}`, error);
    }
});