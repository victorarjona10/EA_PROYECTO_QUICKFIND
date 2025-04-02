import { Router } from "express";
import {
  postAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
} from "../controllers/admin.controller";

const router = Router();

router.post("/", postAdmin);
router.get("/", getAllAdmins);
router.get("/:id", getAdminById);
router.put("/:id", updateAdminById);
router.delete("/:id", deleteAdminById);
router.post("/login", loginAdmin);
export default router;
