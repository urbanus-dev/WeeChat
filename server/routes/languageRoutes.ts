import { Router } from 'express';
import { getSupportedLanguages } from '../controllers/getLanguages';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const languages = await getSupportedLanguages();
        res.status(200).json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(400).json({ error: 'An error occurred while fetching languages' });
    }
});

export default router;