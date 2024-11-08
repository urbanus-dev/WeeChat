import { Router } from "express";
import { createMessage ,getMessages} from "../controllers/messages";
const router = Router();
router.get('/getMessages', getMessages);
router.post('/createMessages', createMessage);
export default router;