import { Router } from "express";
import { getUser, getUserById, updateUser , deleteUser, registerUser, loginUser} from "../controllers/UserControllers";
// import { getLanguages } from "../controllers/getLanguages";
const router = Router();
router.get('/', getUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/languages', getLanguages);

export default router;