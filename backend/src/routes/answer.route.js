import express from "express";
import { createAnswer, upvoteAnswer } from "../controllers/answer.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createAnswer);
router.patch("/:id/upvote", protectRoute, upvoteAnswer);

export default router; 