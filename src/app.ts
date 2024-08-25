import express from "express";
import { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import DBConnection from "./db/dbConnection";
import authHandler from "./routes/auth.routes";
import projectHandler from "./routes/project.routes";
import taskHandler from "./routes/task.routes";

const app: Application = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
new DBConnection().connect();
const PORT: number = 8000;

app.get("/", (req, res) => {
    res.send("<h1>API ChatCartel </h1>");
});

app.use("/auth", authHandler);
app.use("/project", projectHandler);
app.use("/task", taskHandler);


app.listen(Number(process.env.PORT) || 8000, '0.0.0.0', async () => {
    console.log(`Server is running on port ${PORT}`);
});