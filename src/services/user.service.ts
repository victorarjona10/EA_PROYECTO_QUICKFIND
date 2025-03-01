import { IUser, UserModel } from '../models/user';



export class UserService {
    async postUser(user: Partial<IUser>): Promise<IUser> {
        const newUser = new UserModel(user);
        return await newUser.save();
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
        return await UserModel.findByIdAndUpdate(id, user, {new: true});
    }

    async deleteUserById(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(id);
    }

    
    /*async AddSubjectToUser(user: Partial<IUser>, subjectId: Object[]): Promise<IUser | null> {
        if (!user.subjects) {
            user.subjects = []; // Inicializar el array si no existe
        }
        user.subjects.push(subjectId);
        return await user.save();

    }*/

}
