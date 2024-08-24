import { Router } from "express";
import { createProject, getProjects, getProject, updateProject, deleteProject } from "../controller/project.controller";
import { auth } from "../../middleware/auth";

const router = Router();
router.get("/", auth, getProjects);
router.get("/one/:id", auth, getProject);
router.post("/create", auth, createProject);
router.patch("/update", auth, updateProject);
router.delete("/delete", auth, deleteProject);

export default router;