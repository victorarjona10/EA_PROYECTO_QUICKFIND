import { Router } from "express";
import {
  postAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
} from "../controllers/admin.controller";

const router = Router();

router.post("/", postAdmin);
router.get("/", getAllAdmins);
router.get("/:id", getAdminById);
router.put("/:id", updateAdminById);
router.delete("/:id", deleteAdminById);

export default router;
