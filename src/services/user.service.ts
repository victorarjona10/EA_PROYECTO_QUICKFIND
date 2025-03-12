import { IUser, UserModel } from '../models/user';



export class UserService {
    async postUser(user: Partial<IUser>): Promise<IUser> {
        try {
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

    async getallUsers(): Promise<IUser[]> {
        return await UserModel.find();
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

    async InactivateUserById(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, {Flag: false}, {new: true});
    }

    async ativateUserById(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, {Flag: true}, {new: true});
    }

    async getAllActiveUsers(): Promise<IUser[]> {
        return await UserModel.find({Flag: true});
    }
    
}
