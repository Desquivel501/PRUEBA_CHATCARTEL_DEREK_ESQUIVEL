import { Router } from "express";
import { createTask, getUserTasks, filterTasks } from "../controller/task.controller";
import { auth } from "../../middleware/auth";

const router = Router();
router.post("/create", auth, createTask);
router.get("/", auth, getUserTasks);
router.get("/filter", auth, filterTasks);

export default router;