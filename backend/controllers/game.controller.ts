import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { Calculate } from '../services/game.service';
import { Calculator } from '../services/calculator.service';

const prisma = new PrismaClient();

export const LastByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { code, item, rec } = req.body;
        if (!code) { res.status(200).send({ success: false, message: 'No code found or unknown format type.' }); return; }
        let games = await prisma.games.findFirst({
            where: { game_code: String(code) },
            orderBy: { created_at: 'desc' }
        });
        if (games) {
            try {
                const data = await prisma.game_data.findFirst({
                    where: { game_id: games.game_id },
                    orderBy: { id: 'desc' }
                });
                if (data) {
                    let gameData = JSON.parse(data.game_data);
                    try {
                        const start = performance.now();
                        let x = await Calculate(gameData, rec, item);
                        const elapsed = performance.now() - start;
                        console.log(`Elapsed time: ${elapsed.toFixed(4)} ms`);
                        res.status(200).json({ success: true, data: Object.assign(games, { game: JSON.stringify(x) }) });
                    }
                    catch (e) {
                        console.error(e);
                        res.status(200).json({ success: false, message: `Cannot evaluate gamedata status. ${e}` });
                    }
                }
                else { res.status(200).json({ success: false, message: 'Cannot find this gamedata.' }); }
            }
            catch (e) { res.status(403).json({ success: false, message: `Cannot finish operation. ${e}` }); }
        }
        else { res.status(200).send({ success: false, message: 'Cannot find any current game.' }); }
    } catch (err) { next(err); }
};

export const NextGame = async (req: Request, res: Response, next: NextFunction) => {
    let { game_id, item, rec } = req.body;
    try {
        const data = await prisma.game_data.findFirst({
            where: { game_id: game_id },
            orderBy: { id: 'desc' }
        });
        if (data) {
            let gameData = JSON.parse(data.game_data);
            let x = await Calculate(gameData, rec, item);
            res.status(200).json({ data: x });
        }
        else { res.status(404).json({ message: 'Cannot find this gamedata.' }); }
    }
    catch (e) { res.status(404).json({ message: `Cannot finish operation. ${e}` }); }
};

export const GetCalculator = async (req: Request, res: Response, next: NextFunction) => {
    let { data, item, rec } = req.body;
    try {
        if (data) {
            let x = await Calculator(data, rec, item);
            res.status(200).json({ data: x });
        }
    }
    catch (e) { res.status(404).json({ message: `Cannot finish operation. ${e}` }); }
}