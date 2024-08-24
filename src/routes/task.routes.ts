import { Router } from "express";
import { createTask, getTasks, filterTasks, updateTask, deleteTask } from "../controller/task.controller";
import { auth } from "../../middleware/auth";

const router = Router();
router.post("/create", auth, createTask);
router.get("/", auth, getTasks);
router.get("/filter", auth, filterTasks);
router.patch("/update", auth, updateTask);
router.delete("/delete", auth, deleteTask);

export default router;