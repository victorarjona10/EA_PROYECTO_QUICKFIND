import { IUser, UserModel } from "../models/user";
import mongoose from "mongoose";
import { verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";
import {encrypt} from "../utils/bcrypt.handle";

export class UserService {

  async getAllUsers(page: number, limit: number): Promise<IUser[]> {
    const skip = (page - 1) * limit;
    return await UserModel.find().skip(skip).limit(limit);
  }

  async InactivateUserById(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { Flag: false },
      { new: true }
    );
  }

  async ativateUserById(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, { Flag: true }, { new: true });
  }

  async getAllActiveUsers(): Promise<IUser[]> {
    return await UserModel.find({ Flag: true });
  }
    async postUser(user: Partial<IUser>): Promise<IUser> {
        try {
            if (!user.password) {
                throw new Error("Password is required");
            }
        user.password = await encrypt(user.password); // Asegúrate de que user.password no sea undefined
        const newUser = new UserModel(user);
        return await newUser.save();
        }
        catch (error: any) {
            if (error.code === 11000) {
                throw new Error("El email ya está registrado");
            }
            console.log(error);
            throw error;
        }
    }

    async getUserByName(name: string): Promise<IUser | null> {
        return await UserModel.findOne({ name });
    }

    async getUserById(id: string): Promise<IUser | null>{
        return await UserModel.findById(id);
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async updateUserById(id: string, user: Partial<IUser>): Promise<IUser | null> {
        try{
            if (user.email) {
                // Buscar si ya existe un usuario con este email
                const existingUser = await UserModel.findOne({ email: user.email });
    
                // Si se encuentra un usuario con el mismo email y su ID no coincide
                if (existingUser && existingUser._id.toString() !== id) {
                    throw new Error("El email ya está registrado");
                }
            }           
            return await UserModel.findByIdAndUpdate(id, user, {new: true});
        }
        catch (error: any) {
            if (error.code === 11000) {
                throw new Error("El email ya está registrado");
            }
            console.log(error);
            throw error;
        }
    }
    
    async getUsersByFiltration(user : Partial<IUser>, page: number, limit: number): Promise<IUser[]> {
        const skip = (page - 1) * limit;
        
        // Eliminar campos nulos o indefinidos del objeto users
        const filter: Partial<IUser> = Object.fromEntries(
        Object.entries(user).filter(([_, value]) => value != null)
        );

        // Convertir los valores de los campos en expresiones regulares para búsqueda parcial
        const regexFilter: Partial<IUser> = Object.fromEntries(
        Object.entries(filter).map(([key, value]) => [key, { $regex: new RegExp(value as string, "i") }])
        );


        return await UserModel.find(regexFilter).skip(skip).limit(limit);
    }

}
