import { Router } from "express";
import {
  addProductToCompany,
  getCompanyReviews,
  reviewCompany,
  RateCompany,
  postCompany,
  getCompanies,
  getAllCompanies,
  getCompanyById,
  deleteCompanyById,
  updateCompanyById,
  getCompanyWithProductsById,
  getCompanyByName,
  getCompaniesByProductName
} from "../controllers/company.controller";
import { checkJwt } from "../middleware/session";

const router = Router();
router.get("/companies", checkJwt, getCompanies);
router.get("/", checkJwt, getAllCompanies);
//router.get('/:id/full', getCompanyWithProductsById);
router.get("/:id/products", checkJwt, getCompanyWithProductsById);
router.post("/", checkJwt, postCompany);
router.get("/:id", checkJwt, getCompanyById);
router.put("/:id", checkJwt, updateCompanyById);
router.delete("/:id", checkJwt, deleteCompanyById);
router.put("/rate/:id", checkJwt, RateCompany);
router.post("/review/:id", checkJwt, reviewCompany);
router.get("/reviews/:id", checkJwt, getCompanyReviews);
router.put("/:id/addProduct", checkJwt, addProductToCompany);
router.get("/search/:search", getCompanyByName);
router.get('/searchProduct/:name', getCompaniesByProductName);


export default router;
