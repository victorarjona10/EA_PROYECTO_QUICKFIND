import { ICompany, CompanyModel } from '../models/company';

export class CompanyService {
    async postCompany(company: Partial<ICompany>): Promise<ICompany> {
        const newCompany = new CompanyModel(company);
        return newCompany.save();
    }

    async getAllCompanies(): Promise<ICompany[]> {
        return CompanyModel.find();
    }

    async getCompanyById(id: string): Promise<ICompany | null> {
        return CompanyModel.findById(id);
    }

    async updateCompanyById(id: string, company: ICompany): Promise<ICompany | null> {
        return CompanyModel.findByIdAndUpdate(id, company, { new: true });
    }

    async deleteCompanyById(id: string): Promise<ICompany | null> {
        return CompanyModel.findByIdAndDelete(id);
    }
}