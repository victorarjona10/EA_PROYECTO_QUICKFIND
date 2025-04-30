import { Router } from 'express';
import { RateCompany, postCompany,  getCompanies, getAllCompanies, getCompanyById, deleteCompanyById, updateCompanyById, getCompanyWithProductsById } from '../controllers/company.controller';
import { checkJwt } from '../middleware/session';

const router = Router();
router.get("/companies", checkJwt,  getCompanies, );
router.get("/", checkJwt,  getAllCompanies);
//router.get('/:id/full', getCompanyWithProductsById);
router.get('/:id/products', checkJwt,  getCompanyWithProductsById);
router.post("/", checkJwt,  postCompany);
router.get('/:id', checkJwt,  getCompanyById);
router.put('/:id', checkJwt,  updateCompanyById);
router.delete('/:id', checkJwt,  deleteCompanyById);
router.put('/rate/:id', checkJwt,  RateCompany);


export default router;