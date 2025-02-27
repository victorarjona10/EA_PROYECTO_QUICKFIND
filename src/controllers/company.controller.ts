import { Request, Response } from 'express';
import { ICompany } from '../models/company';
import { CompanyService } from '../services/company.service';

const companyService = new CompanyService();

export async function postCompany(req: Request, res: Response): Promise<void> {
    try {
        const company = req.body as ICompany;
        const newCompany = await companyService.postCompany(company);
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(400).json({ message: "Error creating company", error });
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
    } catch (error) {
        res.status(400).json({ message: "Error updating company", error });
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