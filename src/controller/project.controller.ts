import {Request, Response} from 'express';
import Project, { IProject } from "../models/project.model";
import Task from "../models/task.model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const createProject = async (req: Request, res: Response) => {
    const { name } = req.body;
    const token = (req as any).token as JwtPayload;

    if (!name ) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const project = new Project({ name, user: token.id });
        await project.save().then((project : IProject) => {
            return res.status(200).json({ message: "Project created successfully", project });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProjects = async (req: Request, res: Response) => {
    const token = (req as any).token as JwtPayload;

    try {

        let projects = await Project.aggregate([
            {
                $match: { user: mongoose.Types.ObjectId.createFromHexString(token.id) }
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "project",
                    as: "tasks"
                }
            }
        ]).exec()
        console.log(projects);

        res.status(200).json(projects);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Project id is required" });
    }

    try {
        const project = await Project.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) }
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "project",
                    as: "tasks"
                }
            }
        ]).exec()

        res.status(200).json(project[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProject = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const token = (req as any).token as JwtPayload;

    if (!id) {
        return res.status(400).json({ message: "Project id is required" });
    }

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

        if (!id) {
            return res.status(400).json({ message: "Project id is required" });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.user.toString() !== token.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Project.findByIdAndDelete(id);
        await Task.deleteMany({ project: id });
        res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}