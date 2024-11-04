import { Router } from "express";
//export { registerUser, loginUser, getUser, getUserById, updateUser , deleteUser};
import { getUser, getUserById, updateUser , deleteUser, registerUser, loginUser} from "../controllers/UserControllers";
const router = Router();
router.get('/', getUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;