import { Router } from "express";
import {
  postAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
} from "../controllers/admin.controller";
import { checkJwt } from "../middleware/session";

const router = Router();

router.post("/", checkJwt,  postAdmin);
router.get("/", checkJwt, getAllAdmins);
router.get("/:id", checkJwt, getAdminById);
router.put("/:id", checkJwt, updateAdminById);
router.delete("/:id", checkJwt, deleteAdminById);
router.post("/login", loginAdmin);
export default router;
