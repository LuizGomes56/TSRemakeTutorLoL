import { Router } from 'express';
import gameRouter from './game.route';
import lolRouter from './lol.route';

const router = Router();

router.use('/game', gameRouter);
router.use('/lol', lolRouter);

export default router;