import { Router } from 'express';
import gameRouter from './game.route';
import lolRouter from './lol.route';
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.use('/game', gameRouter);
router.use('/lol', lolRouter);
router.get('/version', (req, res) => res.send({ version: process.env.LOL_VERSION }));

export default router;
