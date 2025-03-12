import { Request, Response } from 'express';
import { ICompany } from '../models/company';
import { CompanyService } from '../services/company.service';
import { ProductModel } from '../models/product';


const companyService = new CompanyService();

export async function postCompany(req: Request, res: Response): Promise<void> {
    try {
        const company = req.body as ICompany;
        const newCompany = await companyService.postCompany(company);
        res.status(201).json(newCompany);
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

export async function getAllCompanies(req: Request, res: Response): Promise<void> {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        res.status(400).json({ message: "Error getting companies", error });
    }
}

export async function getCompanyById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const company = await companyService.getCompanyById(id);
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: "Error getting company", error });
    }
}

export async function updateCompanyById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const company = req.body as ICompany;
        const updatedCompany = await companyService.updateCompanyById(id, company);
        res.status(200).json(updatedCompany);
    } catch (error: any) {
        if (error.message === "El email ya está registrado") {
            // Enviar una respuesta clara para el error de email duplicado
            res.status(400).json({ message: error.message });
        } else {
            // Manejo genérico de errores
            res.status(500).json({ message: "Error al actualizar el usuario", error });
        }
    }
}

export async function deleteCompanyById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const deletedCompany = await companyService.deleteCompanyById(id);
        res.status(200).json(deletedCompany);
    } catch (error) {
        res.status(400).json({ message: "Error deleting company", error });
    }
}

export async function getCompanyWithProductsById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const company = await companyService.getCompanyWithProductsById(id);
        if (!company) {
            throw new Error('Company not found');
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: "Error getting company with products", error });
    }
}