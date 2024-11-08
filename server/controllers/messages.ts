import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const createMessage = async (req: Request, res: Response): Promise<void> => {
    const { senderId, receiverId, content } = req.body;

    try {
        const sender = await prisma.user.findUnique({ where: { id: senderId } });
        if (!sender) {
            res.status(404).json({ error: 'Sender not found' });
            return;
        }

        const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
        if (!receiver) {
            res.status(404).json({ error: 'Receiver not found' });
            return;
        }
        const message = await prisma.message.create({
            data: {
                content,
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'An error occurred while creating the message' });
    }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    const { senderId, receiverId } = req.query;

    try {
        const sender = await prisma.user.findUnique({ where: { id: Number(senderId) } });
        const receiver = await prisma.user.findUnique({ where: { id: Number(receiverId) } });

        if (!sender || !receiver) {
            res.status(404).json({ error: 'Sender or Receiver not found' });
            return;
        }
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: Number(senderId), receiverId: Number(receiverId) },
                    { senderId: Number(receiverId), receiverId: Number(senderId) }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'An error occurred while retrieving messages' });
    }
};