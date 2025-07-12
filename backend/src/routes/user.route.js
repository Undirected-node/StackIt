import express from "express";
import { getTopUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/top-users", getTopUsers);

export default router; 