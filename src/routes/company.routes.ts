import { Router } from 'express';
import { postCompany, getAllCompanies, getCompanyById, deleteCompanyById, updateCompanyById } from '../controllers/company.controller';

const router = Router();

router.get("/", getAllCompanies);
router.post("/", postCompany);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompanyById);
router.delete('/:id', deleteCompanyById);

export default router;