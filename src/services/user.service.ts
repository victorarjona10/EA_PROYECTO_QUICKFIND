import { IUser, UserModel } from "../models/user";

export class UserService {
  async postUser(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async getAllUsers(page: number, limit: number): Promise<IUser[]> {
    const skip = (page - 1) * limit;
    return await UserModel.find().skip(skip).limit(limit);
  }

  async getUserByName(name: string): Promise<IUser | null> {
    return await UserModel.findOne({ name });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async updateUserById(
    id: string,
    user: Partial<IUser>
  ): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, user, { new: true });
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
}
