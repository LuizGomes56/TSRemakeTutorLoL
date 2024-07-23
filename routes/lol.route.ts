import { Router } from 'express';
import { FetchCache, FetchChampions, FetchItems, FetchPassives, FetchRunes, FetchSpells } from '../controllers/lol.controller';

const api = Router();

api.get('/champions', FetchChampions);
api.get('/items', FetchItems);
api.get('/passives', FetchPassives);
api.get('/runes', FetchRunes);
api.get('/spells', FetchSpells);
api.get('/cache', FetchCache);

export default api;