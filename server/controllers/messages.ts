import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { translateMessage } from './messageTranslation';

const prisma = new PrismaClient();

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    const { user1, user2 } = req.query;

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: Number(user1), receiverId: Number(user2) },
                    { senderId: Number(user2), receiverId: Number(user1) }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        const user = await prisma.user.findUnique({
            where: { id: Number(user1) },
            select: { languagePreference: true }
        });

        const translatedMessages = await Promise.all(
            messages.map(async (message) => {
                if (message.senderId !== Number(user1)) {
                    message.content = await translateMessage(message.content, user?.languagePreference || 'en');
                }
                return message;
            })
        );

        res.status(200).json(translatedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        let chat = await prisma.chat.findUnique({
            where: {
                id: receiverId 
            }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    id: receiverId, 
                    users: {
                        connect: [{ id: senderId }, { id: receiverId }]
                    }
                }
            });
        }

        const chatId = chat.id;
        const message = await prisma.message.create({
            data: {
                content,
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } },
                chat: { connect: { id: chatId } } 
            }
        });

        // Return the newly created message
        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'An error occurred while creating the message' });
    }
};
