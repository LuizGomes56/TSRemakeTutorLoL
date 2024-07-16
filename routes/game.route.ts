import { Router } from 'express';
import * as Controller from '../controllers/game.controller'

const api = Router();

api.post('/next', Controller.example);
api.post('/last', Controller.example);

export default api;