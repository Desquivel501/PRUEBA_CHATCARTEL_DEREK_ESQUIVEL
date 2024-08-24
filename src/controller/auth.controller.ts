import {Request, Response} from 'express';
import User from "../models/user.model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "Email is already in use" });
        }

        const newUser = new User({ email, password });
        newUser.hashPassword();
        await newUser.save();

        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        if (!user.validatePassword(password)) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as Secret, { expiresIn: "2 days" });


        res.status(200).json({ message: "User logged in successfully", token: token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const me = async (req: Request, res: Response) => {
    const token = (req as any).token as JwtPayload;

    try {
        const user = await User.findById(token.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}