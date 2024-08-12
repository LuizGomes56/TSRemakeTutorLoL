import { ChampionList, ControllerArts, ControllerCache, ControllerChampions, ControllerItems, ControllerPassives, ControllerReplacements, ControllerRunes, ControllerSpells, ControllerUpdate, ItemList, RuneList } from '../controllers/lol.controller';
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
api.get('/all/runes', RuneList)
api.get('/replacements', ControllerReplacements);

export default api;