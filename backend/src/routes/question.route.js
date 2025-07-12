import express from "express";
import { createQuestion, getQuestions, getQuestionById } from "../controllers/question.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);

export default router; 