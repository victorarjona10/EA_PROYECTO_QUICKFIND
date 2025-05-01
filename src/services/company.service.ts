import { ICompany, CompanyModel } from '../models/company';
import { IReview, ReviewModel } from '../models/review';

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
        return CompanyModel.find().populate('products').exec();
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

    async RateCompany(id: string, rating: number): Promise<ICompany | null> {
        const company = await CompanyModel.findById(id);
        if (!company) {
            throw new Error("Company not found");
        }   
        const newRating = (company.rating * company.userRatingsTotal + rating) / (company.userRatingsTotal + 1);
        company.rating = newRating;
        company.userRatingsTotal += 1;
        return company.save();
    }

    async reviewCompany(review: Partial<IReview>): Promise<IReview | null> {
        if (!review.user_id || !review.company_id || review.rating === undefined) {
            throw new Error("Faltan datos obligatorios para crear o actualizar la reseña");
        }
    
        const company = await CompanyModel.findById(review.company_id);
        if (!company) {
            throw new Error("Company not found");
        }
    
        // Comprueba si la empresa ya tiene una reseña del usuario
        const existingReview = await ReviewModel.findOne({ user_id: review.user_id, company_id: review.company_id });
        if (existingReview) {
            // Actualiza la reseña existente
            const updatedReview = await ReviewModel.findByIdAndUpdate(existingReview._id, review, { new: true });
            if (!updatedReview) {
                throw new Error("Error al actualizar la reseña");
            }
    
            // Actualiza la calificación de la empresa
            const updatedRating = parseFloat(
                ((company.rating * company.userRatingsTotal - existingReview.rating + review.rating) / company.userRatingsTotal).toFixed(2)
            );
            company.rating = updatedRating;
    
            // Actualiza el vector de reseñas de la empresa
            company.reviews = company.reviews?.map((r) => (r.toString() === existingReview._id.toString() ? updatedReview._id : r));
    
            await company.save();
            return updatedReview;
        } else {
            // Crea una nueva reseña
            const newReview = new ReviewModel(review);
    
            company.reviews?.push(newReview._id);
            company.rating = parseFloat(
                ((company.rating * company.userRatingsTotal + review.rating) / (company.userRatingsTotal + 1)).toFixed(2)
            );
            company.userRatingsTotal += 1;
    
            await company.save();
            return newReview.save();
        }
    }

    async getCompanyReviews(companyId: string): Promise<IReview[]> {
        console.log("Company ID:", companyId);
        if (!companyId || companyId.length !== 24) {
            throw new Error("ID inválido");
        }
        const reviews = await ReviewModel.find({ company_id: companyId }).populate('user_id').exec();
        console.log("Reviews:", reviews);
        return ReviewModel.find({ company_id: companyId }).populate('user_id').exec();
    }
}