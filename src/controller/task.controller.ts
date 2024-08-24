import {Request, Response} from 'express';
import Project, { ITask } from "../models/project.model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';


export const createTask = async (req: Request, res: Response) => {
    const { projectId, name, description, status, creationDate } = req.body;
    const token = (req as any).token as JwtPayload;

    if ( !projectId || !name || !description || !status || !creationDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.updateOne({ $push: { tasks: { name, description, status, creationDate } } });

        res.status(200).json({ message: "Task created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserTasks = async (req: Request, res: Response) => {
    const token = (req as any).token as JwtPayload;

    try {
        const projects = await Project.find({ user: token.id });
        const tasks = projects.map(project => project.tasks);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const filterTasks = async (req: Request, res: Response) => {
    try {

        const { status, startDate, endDate, id, page, limit } = req.query;
        const token = (req as any).token as JwtPayload;

        const query: any = { user: token.id };

        const pageNumber = parseInt(page as string) || 1;
        const size = parseInt(limit as string) || 10;

        let projects = await Project.find({ user: token.id });
        if (id) {
            projects = projects.filter(project => project._id == id);
        }

        let tasks = projects.map(project => project.tasks)[0];


        if (status) {
            tasks = tasks.filter(task => task.status == status);
        }

        if (startDate && endDate) {
            tasks = tasks.filter(task => new Date(task.creationDate) >= new Date(startDate as string) && new Date(task.creationDate) <= new Date(endDate as string));
        } else if (startDate) {
            tasks = tasks.filter(task => new Date(task.creationDate) >= new Date(startDate as string));
        } else if (endDate) {
            tasks = tasks.filter(task => new Date(task.creationDate) <= new Date(endDate as string));
        }

        const totalPages = Math.ceil(tasks.length / size);
        const start = (pageNumber - 1) * size;

        tasks = tasks.slice(start, start + size);


        res.status(200).json({
            tasks,
            totalPages,
            currentPage: pageNumber
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

