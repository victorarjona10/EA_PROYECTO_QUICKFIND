import { IAdmin, AdminModel } from "../models/admin";

export class AdminService {
  async postAdmin(admin: Partial<IAdmin>): Promise<IAdmin> {
    const newAdmin = new AdminModel(admin);
    return newAdmin.save();
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    return AdminModel.find();
  }

  async getAdminById(id: string): Promise<IAdmin | null> {
    return AdminModel.findById(id);
  }

  async updateAdminById(id: string, admin: IAdmin): Promise<IAdmin | null> {
    return AdminModel.findByIdAndUpdate(id, admin, { new: true });
  }

  async deleteAdminById(id: string): Promise<IAdmin | null> {
    return AdminModel.findByIdAndDelete(id);
  }
}
