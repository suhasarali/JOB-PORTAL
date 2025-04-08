import express from "express";
import { register, login, updateProfile, logout  } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/profile/update", isAuthenticated, updateProfile);
router.get("/logout", logout);

export default router;