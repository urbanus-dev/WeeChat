import { fetch } from 'undici';

export const translateMessage = async (text: string, targetLang: string): Promise<string> => {
    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.TRANSLATOR_API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{ Text: text }])
        });

        if (!response.ok) {
            throw new Error('Failed to translate message');
        }

        const data = await response.json() as { translations: { text: string }[] }[];
        return data[0].translations[0].text;
    } catch (error) {
        console.error('Error translating message:', error);
        throw error;
    }
};
