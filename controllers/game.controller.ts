export const example = (): void => {
    console.log("API Running")
}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Rota para cadastrar um novo curso
/*
async (req, res, next) => {
    try {
        const { name, area_id, cover } = req.body;
        const fn = await prisma.course.create({
            data: {
                name,
                area_id,
                cover
            },
        });
        res.status(201).json(fn);
    } catch (error) {
        next(error);
    }
};
*/