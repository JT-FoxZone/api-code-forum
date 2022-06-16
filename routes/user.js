import express from "express";
import { getAllUser } from "../controllers/userController.js";

const router = express.Router()

router.get('/getAllUser', getAllUser)

export default router