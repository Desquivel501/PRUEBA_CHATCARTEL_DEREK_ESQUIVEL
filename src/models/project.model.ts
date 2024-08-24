import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    name: string;
    description: string;
    status: string;
    creationDate: Date;
}

export interface IProject extends Document {
    name: string;
    user: string;
    tasks: ITask[];
}

// Esquema de tareas
const TaskSchema = new Schema<ITask>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, required: true },
        creationDate: { type: Date, required: true }
    },
    { timestamps: true }
);

// Esquema de proyectos
const ProjectSchema = new Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 50, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        tasks: { type: [TaskSchema], required: true }
    },
    { timestamps: true }
);

const Project = mongoose.model<IProject>("Projects", ProjectSchema);
export default Project;