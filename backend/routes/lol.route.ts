import { ChampionList, ControllerArts, ControllerCache, ControllerChampions, ControllerItems, ControllerPassives, ControllerRunes, ControllerSpells, ControllerUpdate, ItemList } from '../controllers/lol.controller';
import { Router } from 'express';

const api = Router();

api.get('/champions', ControllerChampions);
api.get('/items', ControllerItems);
api.get('/passives', ControllerPassives);
api.get('/runes', ControllerRunes);
api.get('/spells', ControllerSpells);
api.get('/cache', ControllerCache);
api.get('/update', ControllerUpdate);
api.get('/arts', ControllerArts);
api.get('/all/items', ItemList);
api.get('/all/champions', ChampionList);

export default api;