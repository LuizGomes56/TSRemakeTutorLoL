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

interface RuneOld {
    name: string;
    type: string;
    effect?: string;
    melee?: string;
    ranged?: string;
}

interface RuneDataOld {
    [key: string]: RuneOld;
}

export interface LocalRunesOld {
    type: string;
    version: string;
    data: RuneDataOld;
}

function adaptRuneFile(rune: RuneOld): Rune {
    const newRune: Rune = {
        name: rune.name,
        type: rune.type,
        min: {
            melee: rune.effect || "",
            ranged: rune.effect || ""
        }
    };

    if (rune.melee && rune.ranged) {
        newRune.min = {
            melee: rune.melee,
            ranged: rune.ranged
        };
    }

    return newRune;
}

function adaptData(oldData: LocalRunesOld): LocalRunes {
    const newData: LocalRunes = {
        type: oldData.type,
        version: oldData.version,
        data: {}
    };

    for (const key in oldData.data) {
        if (Object.prototype.hasOwnProperty.call(oldData.data, key)) {
            newData.data[key] = adaptRuneFile(oldData.data[key]);
        }
    }

    return newData;
}

// Assume we have the old data loaded as `oldData`
const oldData: LocalRunesOld = require('./effects/runes.json');
const newData: LocalRunes = adaptData(oldData);

// Save the new data to a JSON file
const fs = require('fs');
fs.writeFileSync('./new_runes.json', JSON.stringify(newData, null, 2), 'utf8');
