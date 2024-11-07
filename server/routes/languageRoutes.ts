import { Router } from "express";
import { getLanguages } from "../controllers/getLanguages";
const router = Router();

router.get('/', getLanguages);

export default router;