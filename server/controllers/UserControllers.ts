import { Request, Response } from "express";
const { PrismaClient } = require('@prisma/client');
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import { getSupportedLanguages } from "./getLanguages";

function generateToken(id: any) {
    const secretKey = process.env.JWT_SECRET || '';
    return jwt.sign({ id }, secretKey, { expiresIn: '7d' });
}

interface UseRecords {
    id: number;
    email: string;
    Username: string;
    password: string;
    confirmPassword?: string;
    languagePreference: string;
}

const sendResponse = (res: Response, statusCode: number, data: any) => {
    res.status(statusCode).json(data);
}

const validateRegisterBody = (body: UseRecords) => {
    const { email, Username, password, confirmPassword, languagePreference } = body;
    if (!email || !Username || !password || !confirmPassword || !languagePreference) {
        return 'All fields are required';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }


    return null;
}

const validateLoginBody = (body: UseRecords) => {
    const { email, password } = body;
    if (!email || !password) {
        return 'Email and password are required';
    }
    return null;
}

export const registerUser = async (req: Request<{}, {}, UseRecords>, res: Response): Promise<void> => {
    const validationError = validateRegisterBody(req.body);
    if (validationError) {
        return sendResponse(res, 400, { error: validationError });
    }

    const { email, Username, password, languagePreference } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return sendResponse(res, 400, { error: 'Email already exists' });
        }
        const existingUsername = await prisma.user.findUnique({
            where: { Username }
        });
        if (existingUsername) {
            return sendResponse(res, 400, { error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                Username,
                password: hashedPassword,
                languagePreference
            }
        });

        sendResponse(res, 201, { message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        sendResponse(res, 400, { error: 'An error occurred while registering the user' });
    }
}

export const loginUser = async (req: Request<{}, {}, UseRecords>, res: Response): Promise<void> => {
    const validationError = validateLoginBody(req.body);
    if (validationError) {
        return sendResponse(res, 400, { error: validationError });
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return sendResponse(res, 400, { error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendResponse(res, 400, { error: 'Invalid email or password' });
        }
        const token = generateToken(user.id);
        res.status(200).json({
            token,
            message: `Welcome ${user.Username}`,
            Username: user.Username,
            userId: user.id
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        sendResponse(res, 400, { error: 'An error occurred while logging in the user' });
    }
}


export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        sendResponse(res, 200, users);
    } catch (error) {
        console.error('Error getting users:', error);
        sendResponse(res, 400, { error: 'An error occurred while getting users' });
    }
}

export const getUserById = async (id: number): Promise<{ languagePreference?: string } | null> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                languagePreference: true
            }
        });
        return user;
    } catch (error) {
        console.error('Error getting user by id:', error);
        throw new Error('An error occurred while getting user by id');
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { email, Username, password, languagePreference } = req.body;
    if (!email || !Username || !password || !languagePreference) {
        return sendResponse(res, 400, { error: 'Email, Username, password, and languagePreference are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!user) {
            return sendResponse(res, 404, { error: 'User not found' });
        }
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                Username,
                password,
                languagePreference
            }
        });
        sendResponse(res, 200, updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        sendResponse(res, 400, { error: 'An error occurred while updating user' });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!user) {
            return sendResponse(res, 404, { error: 'User not found' });
        }
        await prisma.user.delete({
            where: {
                id: parseInt(id)
            }
        });
        sendResponse(res, 204, null);
    } catch (error) {
        console.error('Error deleting user:', error);
        sendResponse(res, 400, { error: 'An error occurred while deleting user' });
    }
}
export default { registerUser, getUser, getUserById, updateUser, deleteUser };