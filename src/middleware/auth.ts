import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";

dotenv.config();

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        (req as CustomRequest).token = decoded;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default auth;