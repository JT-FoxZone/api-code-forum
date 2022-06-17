import express from "express";
import { getAllUser, Register, Login } from "../controllers/userController.js";

const router = express.Router()

router.get('/getAllUser', getAllUser)
router.post('/register', Register)
router.post('/login', Login)

export default router