import { Router } from "express";
import { checkJwt } from "../middleware/session";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackByUserId,
  updateFeedbackStatus,
  deleteFeedback,
} from "../controllers/feedback.controller";

const router = Router();

// Crear feedback (protegido)
router.post("/", checkJwt, createFeedback);

// Obtener todos los feedbacks (protegido)
router.get("/", checkJwt, getAllFeedback);

// Obtener un feedback por ID (protegido)
router.get("/:id", checkJwt, getFeedbackById);

// Obtener feedbacks de un usuario (protegido)
router.get("/user/:userId", checkJwt, getFeedbackByUserId);

// Actualizar estado de un feedback (protegido)
router.put("/:id/status", checkJwt, updateFeedbackStatus);

// Eliminar un feedback (protegido)
router.delete("/:id", checkJwt, deleteFeedback);

export default router;
