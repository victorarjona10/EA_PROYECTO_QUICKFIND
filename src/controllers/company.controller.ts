import { Request, Response } from 'express';
import { ICompany } from '../models/company';
import { CompanyService } from '../services/company.service';
import { ProductModel } from '../models/product';


const companyService = new CompanyService();

export async function postCompany(req: Request, res: Response): Promise<void> {
    try {
        const company = req.body as ICompany;
        if (!company.name || !company.email || !company.password) {
            res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
        }

        const newCompany = await companyService.postCompany(company);
        res.status(201).json(newCompany);
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(403).json({ message: "El email ya está registrado" });
        } else {
            res.status(500).json({ message: "Error al crear la empresa", error: error.message });
        }
    }
}

export async function getAllCompanies(req: Request, res: Response): Promise<void> {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Error getting companies", error });
    }
}

export async function getCompanyById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }
        const company = await companyService.getCompanyById(id);
        if (!company) {
            res.status(404).json({ message: "Empresa no encontrada" });
            return;
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Error getting company", error });
    }
}

export async function updateCompanyById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }
        const company = req.body as ICompany;
        const updatedCompany = await companyService.updateCompanyById(id, company);
        if (!updatedCompany) {
            res.status(404).json({ message: "Empresa no encontrada" });
            return;
        }
        res.status(200).json(updatedCompany);
    } catch (error: any) {
        if (error.message === "El email ya está registrado") {
            // Enviar una respuesta clara para el error de email duplicado
            res.status(403).json({ message: error.message });
        } else {
            // Manejo genérico de errores
            res.status(500).json({ message: "Error al actualizar el usuario", error });
        }
    }
}

export async function deleteCompanyById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }
        const deletedCompany = await companyService.deleteCompanyById(id);
        if (!deletedCompany) {
            res.status(404).json({ message: "Empresa no encontrada" });
            return;
        }
        res.status(200).json(deletedCompany);
    } catch (error) {
        res.status(500).json({ message: "Error deleting company", error });
    }
}

export async function getCompanyWithProductsById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }
        const company = await companyService.getCompanyWithProductsById(id);
        if (!company) {
            throw new Error('Company not found');
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Error getting company with products", error });
    }
}