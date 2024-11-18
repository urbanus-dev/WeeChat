import { Router } from 'express';
import { registerUser, loginUser, getUser, getUserById, updateUser, deleteUser } from '../controllers/UserControllers';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUser);
// router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;