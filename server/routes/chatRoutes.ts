import { Router } from "express";
import { createChat } from "../controllers/chats";
const router = Router();
router.post('/', createChat);
