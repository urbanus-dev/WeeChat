import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createChat = async (req: Request, res: Response): Promise<void> => {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length < 2) {
        res.status(400).json({ error: 'Invalid user IDs' });
        return;
    }

    try {
        const chat = await prisma.chat.create({
            data: {
                users: {
                    connect: userIds.map((id: number) => ({ id }))
                }
            }
        });
        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'An error occurred while creating the chat' });
    }
};