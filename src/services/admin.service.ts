import { IAdmin, AdminModel } from "../models/admin";

export class AdminService {
  async postAdmin(admin: Partial<IAdmin>): Promise<IAdmin> {
    try {
    const newAdmin = new AdminModel(admin);
    return newAdmin.save();
  }
  catch (error: any) {
    if (error.code === 11000) {
        throw new Error("El email ya está registrado");
    }
    console.log(error);
    throw error;
}
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    return AdminModel.find();
  }

  async getAdminById(id: string): Promise<IAdmin | null> {
    return AdminModel.findById(id);
  }

  async updateAdminById(id: string, admin: IAdmin): Promise<IAdmin | null> {
     try{
        if (admin.email) {
           // Buscar si ya existe un usuario con este email
            const existingAdmin = await AdminModel.findOne({ email: admin.email });
        
            // Si se encuentra un usuario con el mismo email y su ID no coincide
            if (existingAdmin && existingAdmin._id.toString() !== id) {
              throw new Error("El email ya está registrado");
              }
        }  
    return AdminModel.findByIdAndUpdate(id, admin, { new: true });
    }
    catch (error: any) {
      if (error.code === 11000) {
          throw new Error("El email ya está registrado");
      }
      console.log(error);
      throw error;
    }
  }

  async deleteAdminById(id: string): Promise<IAdmin | null> {
    return AdminModel.findByIdAndDelete(id);
  }
}
