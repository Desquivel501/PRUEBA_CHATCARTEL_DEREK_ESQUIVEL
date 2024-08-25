import { Router } from "express";
import { createTask, getTasks, filterTasks, updateTask, deleteTask, reportTasks } from "../controller/task.controller";
import { auth } from "../../middleware/auth";

const router = Router();
router.get("/", auth, getTasks);
router.post("/create", auth, createTask);
router.get("/filter", auth, filterTasks);
router.patch("/update", auth, updateTask);
router.delete("/delete", auth, deleteTask);
router.get("/report", auth, reportTasks);

export default router;