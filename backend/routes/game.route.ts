import { Router } from 'express';
import { LastByCode, NextGame } from '../controllers/game.controller'

const api = Router();

api.post('/next', NextGame);
api.post('/last', LastByCode);

export default api;