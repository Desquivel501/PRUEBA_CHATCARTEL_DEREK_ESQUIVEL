import {Request, Response} from 'express';
import Project from "../models/project.model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export const createProject = async (req: Request, res: Response) => {
    const { name } = req.body;
    const token = (req as any).token as JwtPayload;

    if (!name ) {
        return res.status(400).json({ message: "Name and description are required" });
    }

    try {
        const project = new Project({ name, user: token.id });
        await project.save();

        res.status(200).json({ message: "Project created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProjects = async (req: Request, res: Response) => {
    const token = (req as any).token as JwtPayload;

    try {
        const projects = await Project.find({ user: token.id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProject = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const token = (req as any).token as JwtPayload;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.user.toString() !== token.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        project.name = name;
        await project.save();

        res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.body;
    const token = (req as any).token as JwtPayload;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.user.toString() !== token.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Project.findByIdAndDelete(id);

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}