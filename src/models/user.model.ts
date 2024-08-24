import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email: string;
    password: string;
    hashPassword(): void;
    validatePassword(password: string): boolean;
}

// Esquema de usuarios
const UserSchema = new Schema(
    {
        email: { type: String, required: true, minlength: 3, maxlength: 50, unique: true },
        password: { type: String, required: true, minlength: 6, maxlength: 1024 },
    },
    { timestamps: true }
);

// Metodo para encriptar la contraseña del usuario
UserSchema.method("hashPassword", function (): void {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);

    this.password = hash;
});

// Metodo para validar la contraseña del usuario
UserSchema.method("validatePassword", function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
});


const User = mongoose.model<IUser>("Users", UserSchema);
export default User;