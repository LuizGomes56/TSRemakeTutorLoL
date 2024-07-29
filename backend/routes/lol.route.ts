import { Router } from 'express';
import { FetchCache, FetchChampions, FetchItems, FetchPassives, FetchRunes, FetchSpells, ItemList } from '../controllers/lol.controller';

const api = Router();

api.get('/champions', FetchChampions);
api.get('/items', FetchItems);
api.get('/passives', FetchPassives);
api.get('/runes', FetchRunes);
api.get('/spells', FetchSpells);
api.get('/cache', FetchCache);
api.get('/all/items', ItemList);
// api.get('/all/champions', ChampionList);
// api.get('/all/runes', RuneList)

export default api;