interface PathwayMin {
  melee: string;
  ranged: string;
}

interface Pathway {
  min: PathwayMin;
  max?: PathwayMin;
}

interface ItemFileNew {
  name: string;
  type: string;
  min: PathwayMin;
  max?: PathwayMin;
  onhit?: boolean;
  effect?: number[];
  pathway?: Pathway; // Pathway should be optional
}

interface ItemDataNew {
  [key: string]: ItemFileNew;
}

interface LocalItemsNew {
  type: string;
  version: string;
  data: ItemDataNew;
}

interface Variation {
  melee: string;
  ranged: string;
}

interface PathwayOld {
  melee: {
    damage: string;
    variation?: string;
  };
  ranged: {
    damage: string;
    variation?: string;
  };
}

interface ItemFileOld {
  name: string;
  type: string;
  melee?: string;
  ranged?: string;
  effect?: number[][];
  variation?: Variation;
  pathway?: PathwayOld;
  onhit: boolean;
}

interface ItemDataOld {
  [key: string]: ItemFileOld;
}

interface LocalItemsOld {
  type: string;
  version: string;
  data: ItemDataOld;
}

function adaptItemFile(item: ItemFileOld): ItemFileNew {
  const newItem: ItemFileNew = {
    name: item.name,
    type: item.type,
    min: {
      melee: item.melee || "",
      ranged: item.ranged || ""
    }
  };

  if (item.variation) {
    newItem.max = {
      melee: item.variation.melee,
      ranged: item.variation.ranged
    };
  }

  if (item.onhit !== undefined) {
    newItem.onhit = item.onhit;
  }

  if (item.effect && item.effect.length === 18) {
    newItem.effect = item.effect.map(e => e[0]);
    newItem.pathway = {
      min: {
        melee: item.melee || "",
        ranged: item.ranged || ""
      },
      max: item.variation ? {
        melee: item.variation.melee,
        ranged: item.variation.ranged
      } : undefined
    };
  }

  return newItem;
}

function adaptData(oldData: LocalItemsOld): LocalItemsNew {
  const newData: LocalItemsNew = {
    type: oldData.type,
    version: oldData.version,
    data: {}
  };

  for (const key in oldData.data) {
    if (Object.prototype.hasOwnProperty.call(oldData.data, key)) {
      newData.data[key] = adaptItemFile(oldData.data[key]);
    }
  }

  return newData;
}

// Assume we have the old data loaded as `oldData`
const oldData: LocalItemsOld = require('./effects/items.json');
const newData: LocalItemsNew = adaptData(oldData);

// Save the new data to a JSON file
const fs = require('fs');
fs.writeFileSync('./new_items.json', JSON.stringify(newData, null, 2), 'utf8');
