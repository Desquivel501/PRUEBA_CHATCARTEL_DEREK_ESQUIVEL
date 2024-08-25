import mongoose, { Schema, Document } from "mongoose";
export interface IProject extends Document {
    name: string;
    user: string;
}

// Esquema de proyectos
const ProjectSchema = new Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 50, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
    { timestamps: true }
);

const Project = mongoose.model<IProject>("Projects", ProjectSchema);
export default Project;