
import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",         signup);
router.post("/login",          login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;