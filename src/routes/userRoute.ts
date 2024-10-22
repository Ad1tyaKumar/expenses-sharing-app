import express from 'express';
import { getAllUsers, loginUser, registerUser } from '../controllers/userController';

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;