import { Router } from 'express';
import { postCompany,  getCompanies, getAllCompanies, getCompanyById, deleteCompanyById, updateCompanyById, getCompanyWithProductsById } from '../controllers/company.controller';

const router = Router();
router.get("/companies", getCompanies);
router.get("/", getAllCompanies);
//router.get('/:id/full', getCompanyWithProductsById);
router.get('/:id/products', getCompanyWithProductsById);
router.post("/", postCompany);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompanyById);
router.delete('/:id', deleteCompanyById);


export default router;