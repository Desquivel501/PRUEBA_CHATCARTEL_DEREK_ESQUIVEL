import {Request, Response} from 'express';
import Project from "../models/project.model";
import Task, { ITask } from "../models/task.model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';


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

        if (project.user.toString() !== token.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const task = new Task({ name, description, status, creationDate, user: token.id, project: projectId });
        await task.save().then((task: ITask) => {
            return res.status(200).json({ message: "Task created successfully", task });
        });

        // res.status(200).json({ message: "Internal server error" });

        // res.status(200).json({ message: "Task created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const { id, name, description, creationDate, status } = req.body;
    const token = (req as any).token as JwtPayload;

    if (!id) {
        return res.status(400).json({ message: "Task id is required" });
    }

    const fieldsToUpdate: any = {};

    if (name) {
        fieldsToUpdate.name = name;
    }

    if (description) {
        fieldsToUpdate.description = description;
    }

    if (status) {
        fieldsToUpdate.status = status;
    }

    if (creationDate) {
        fieldsToUpdate.creationDate = creationDate;
    }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user.toString() !== token.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Task.findByIdAndUpdate(id, fieldsToUpdate);
        
        res.status(200).json({ message: "Task updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.body;
    const token = (req as any).token as JwtPayload;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user.toString() !== token.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTasks = async (req: Request, res: Response) => {
    try {
        const token = (req as any).token as JwtPayload;

        const tasks = await Task.find({ user: token.id });
        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const filterTasks = async (req: Request, res: Response) => {
    try {

        const { status, startDate, endDate, ProjectId, page, limit } = req.query;
        const token = (req as any).token as JwtPayload;

        const query: any = { user: mongoose.Types.ObjectId.createFromHexString(token.id) };

        if (status) {
            query.status = status;
        }

        if (startDate && endDate) {
            query.creationDate = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        } else if (startDate) {
            query.creationDate = { $gte: new Date(startDate as string) };
        } else if (endDate) {
            query.creationDate = { $lte: new Date(endDate as string) };
        }

        if (ProjectId) {
            query.project = mongoose.Types.ObjectId.createFromHexString(ProjectId as string);
        }

        let tasks = await Task.aggregate([
            {
                $match: query
            }
        ]);

        let pageNumber: number = 1;
        let totalPages: number = 1;

        if (page && limit) {
            pageNumber = parseInt(page as string) || 1;
            const size = parseInt(limit as string) || 10;
            totalPages = Math.ceil(tasks.length / size);

            tasks = await Task.find(query).skip((pageNumber - 1) * size).limit(size);    
        }

        res.status(200).json({
            tasks,
            currentPage: pageNumber,
            totalPages: totalPages
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const reportTasks = async (req: Request, res: Response) => {
    try {
        const token = (req as any).token as JwtPayload;
        const { startDate, endDate, ProjectId } = req.query;

        const query: any = { user: mongoose.Types.ObjectId.createFromHexString(token.id) };
        
        if (startDate && endDate) {
            query.creationDate = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
        } else if (startDate) {
            query.creationDate = { $gte: new Date(startDate as string) };
        } else if (endDate) {
            query.creationDate = { $lte: new Date(endDate as string) };
        }

        if (ProjectId) {
            query.project = mongoose.Types.ObjectId.createFromHexString(ProjectId as string);
        }

        const tasks = await Task.find(query);
        const tasksByStatus = tasks.reduce((acc: any, task: any) => {
            if (!acc[task.status]) {
                acc[task.status] = 1;
            } else {
                acc[task.status] += 1;
            }
            return acc;
        }, {});
        
        tasksByStatus.total = tasks.length;
        tasksByStatus["porcentaje_completadas"] = ((tasksByStatus["completada"]/tasks.length)*100).toFixed(2) + "%" || "0%";

        res.status(200).json(tasksByStatus);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}