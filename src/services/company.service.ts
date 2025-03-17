import { ICompany, CompanyModel } from '../models/company';

export class CompanyService {
    async postCompany(company: Partial<ICompany>): Promise<ICompany> {
        try {
        const newCompany = new CompanyModel(company);
        return newCompany.save();
        }
        catch (error: any) {
            if (error.code === 11000) {
                throw new Error("El email ya está registrado");
            }
            console.log(error);
            throw error;
        }
    }

    async getAllCompanies(): Promise<ICompany[]> {
        return CompanyModel.find();
    }

    async getCompanyById(id: string): Promise<ICompany | null> {
        return CompanyModel.findById(id);
    }

    async updateCompanyById(id: string, company: ICompany): Promise<ICompany | null> {
         try{
                    if (company.email) {
                        // Buscar si ya existe un usuario con este email
                        const existingCompany = await CompanyModel.findOne({ email: company.email });
            
                        // Si se encuentra un usuario con el mismo email y su ID no coincide
                        if (existingCompany && existingCompany._id.toString() !== id) {
                            throw new Error("El email ya está registrado");
                        }
                    }     
        return CompanyModel.findByIdAndUpdate(id, company, { new: true });
         }
         catch (error: any) {
            if (error.code === 11000) {
                throw new Error("El email ya está registrado");
            }
            console.log(error);
            throw error;
        }
    }

    async deleteCompanyById(id: string): Promise<ICompany | null> {
        return CompanyModel.findByIdAndDelete(id);
    }

    async getCompanyWithProductsById(id: string): Promise<ICompany | null> {
        return CompanyModel.findById(id).populate('products').exec();
    }
}