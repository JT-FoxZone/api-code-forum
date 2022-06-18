import express from "express";
import {
  getAllUser,
  getUser,
  Register,
  Login,
  Authen,
  getAllCategory,
  getCategory,
  postQuestion,
  getPost,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/getAllUser", getAllUser);
router.get("/getUser", getUser);
router.post("/register", Register);
router.post("/login", Login);
router.post("/authen", Authen);
router.get("/getAllCate", getAllCategory);
router.get("/getCate/:category_id", getCategory);
router.post("/post", postQuestion);
router.get("/post/:post_id", getPost)

export default router;
