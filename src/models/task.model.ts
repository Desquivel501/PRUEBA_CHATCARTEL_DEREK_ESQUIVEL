import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    name: string;
    description: string;
    status: string;
    creationDate: Date;
    user: string;
    project: string;
}

// Esquema de usuarios
const UserSchema = new Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 50 },
        description: { type: String, required: true},
        status: { type: String, required: true },
        creationDate: { type: Date, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Projects" }
    },
    { timestamps: true }
);

const Task = mongoose.model<ITask>("Tasks", UserSchema);
export default Task;