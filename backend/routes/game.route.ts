import { Router } from 'express';
import { GetCalculator, LastByCode, NextGame } from '../controllers/game.controller'

const api = Router();

api.post('/next', NextGame);
api.post('/last', LastByCode);
api.post('/calculator', GetCalculator);

export default api;