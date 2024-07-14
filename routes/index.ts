import { Router, Response } from 'express';
// import gamesRouter from './games.route';

const router = Router();

router.post('/', (res: Response) => {
    res.send('API running');
});

// router.use('/games', gamesRouter);

export default router;