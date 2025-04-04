import { Request, Response } from "express";
import { IAdmin } from "../models/admin";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export async function postAdmin(req: Request, res: Response): Promise<void> {
  try {
    const admin = req.body as IAdmin;
    const newAdmin = await adminService.postAdmin(admin);
    res.status(201).json(newAdmin);
  } catch (error: any) {
    if (error.message === "El email ya está registrado") {
      // Enviar una respuesta clara para el error de email duplicado
      res.status(400).json({ message: error.message });
    } else {
      // Manejo genérico de errores
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  }
}

export async function getAllAdmins(req: Request, res: Response): Promise<void> {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: "Error getting admins", error });
  }
}

export async function getAdminById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const admin = await adminService.getAdminById(id);
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: "Error getting admin", error });
  }
}

export async function updateAdminById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const admin = req.body as IAdmin;
    const updatedAdmin = await adminService.updateAdminById(id, admin);
    res.status(200).json(updatedAdmin);
  } catch (error: any) {
    if (error.message === "El email ya está registrado") {
      // Enviar una respuesta clara para el error de email duplicado
      res.status(400).json({ message: error.message });
    } else {
      // Manejo genérico de errores
      res
        .status(500)
        .json({ message: "Error al actualizar el usuario", error });
    }
  }
}

export async function deleteAdminById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const deletedAdmin = await adminService.deleteAdminById(id);
    res.status(200).json(deletedAdmin);
  } catch (error) {
    res.status(400).json({ message: "Error deleting admin", error });
  }
}

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const admin = await adminService.loginAdmin(email, password);
  
    res.status(200).json({ message: "Login exitoso", admin });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}
