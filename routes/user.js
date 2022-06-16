import express from "express";
import { getAllUser, Register } from "../controllers/userController.js";

const router = express.Router()

router.get('/getAllUser', getAllUser)
router.post('/register', Register)

export default router