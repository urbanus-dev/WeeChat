import { fetch } from 'undici';
import { Request, Response } from 'express';

export const getSupportedLanguages = async (): Promise<any[]> => {
    const endpoint = 'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0';

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.TRANSLATOR_API_KEY || '',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch languages');
        }

        const data = await response.json() as { translation: { [key: string]: { name: string } } };
        const languages = Object.entries(data.translation).map(([code, details]: [string, any]) => ({
            code,
            name: details.name
        }));
        return languages;
    } catch (error) {
        console.error('Error fetching languages:', error);
        throw error; 
    }
}

export const getLanguages = async (req: Request, res: Response): Promise<void> => {
    try {
        const languages = await getSupportedLanguages();
        res.status(200).json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(400).json({ error: 'An error occurred while fetching languages' });
    }
}