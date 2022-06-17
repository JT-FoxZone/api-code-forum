import express from "express";
import { getAllUser, Register, Login, Authen } from "../controllers/userController.js";

const router = express.Router()

router.get('/getAllUser', getAllUser)
router.post('/register', Register)
router.post('/login', Login)
router.post('/authen', Authen)

export default router