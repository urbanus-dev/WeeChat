import { fetch } from 'undici';

export const translateMessage = async (text: string, targetLang: string, retries = 3): Promise<string> => {
    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.TRANSLATOR_API_KEY || '',
                    'Ocp-Apim-Subscription-Region': 'eastus',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{ Text: text }])
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Failed to translate message:', response.status, errorBody);
                const errorData = JSON.parse(errorBody);
                if (errorData.error && errorData.error.code === 400036) {
                    throw new Error('Invalid target language');
                }
                throw new Error(`Translation API error: ${errorBody}`);
            }

            const data = await response.json() as { translations: { text: string }[] }[];
            return data[0].translations[0].text;
        } catch (error) {
            if (attempt === retries) {
                console.error('Error translating message:', error);
                throw error;
            }
            console.log(`Retrying translation... (${attempt}/${retries})`);
        }
    }

    throw new Error('Failed to translate message after multiple attempts');
};