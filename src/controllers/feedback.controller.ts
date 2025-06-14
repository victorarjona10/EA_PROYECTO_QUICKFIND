import { Request, Response } from "express";
import { IFeedback } from "../models/feedback";
import { FeedbackService } from "../services/feedback.service";


const feedbackService = new FeedbackService();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *               - user_id
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [error, suggestion, rating]
 *               user_id:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       400:
 *         description: Invalid input data
 */
export async function createFeedback(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const feedback = req.body as Partial<IFeedback>;

    // Validar campos obligatorios
    if (
      !feedback.title ||
      !feedback.message ||
      !feedback.type ||
      !feedback.user_id
    ) {
      res.status(400).json({
        message: "Título, mensaje, tipo y ID de usuario son obligatorios",
      });
      return;
    }

    // Validar tipo de feedback
    if (!["error", "suggestion", "rating"].includes(feedback.type)) {
      res.status(400).json({ message: "Tipo de feedback inválido" });
      return;
    }

    // Validar rating si el tipo es "rating"
    if (
      feedback.type === "rating" &&
      (feedback.rating === undefined ||
        feedback.rating < 1 ||
        feedback.rating > 5)
    ) {
      res
        .status(400)
        .json({ message: "La valoración debe ser un número entre 1 y 5" });
      return;
    }

    // Añadir la fecha de creación
    feedback.created_at = new Date();

    const newFeedback = await feedbackService.createFeedback(feedback);
    res.status(201).json(newFeedback);
  } catch (error: any) {
    console.error("Error al crear feedback:", error);
    res
      .status(500)
      .json({ message: "Error al crear feedback", error: error.message });
  }
}

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of all feedback
 *       500:
 *         description: Server error
 */
export async function getAllFeedback(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const feedbacks = await feedbackService.getAllFeedback(page, limit);
    res.status(200).json(feedbacks);
  } catch (error: any) {
    console.error("Error al obtener feedback:", error);
    res
      .status(500)
      .json({ message: "Error al obtener feedback", error: error.message });
  }
}

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback details
 *       404:
 *         description: Feedback not found
 *       400:
 *         description: Invalid ID
 */
export async function getFeedbackById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;

    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const feedback = await feedbackService.getFeedbackById(id);

    if (!feedback) {
      res.status(404).json({ message: "Feedback no encontrado" });
      return;
    }

    res.status(200).json(feedback);
  } catch (error: any) {
    console.error("Error al obtener feedback:", error);
    res
      .status(500)
      .json({ message: "Error al obtener feedback", error: error.message });
  }
}

/**
 * @swagger
 * /api/feedback/user/{userId}:
 *   get:
 *     summary: Get feedback by user ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's feedback
 *       400:
 *         description: Invalid user ID
 */
export async function getFeedbackByUserId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.userId;

    if (!userId || userId.length !== 24) {
      res.status(400).json({ message: "ID de usuario inválido" });
      return;
    }

    const feedbacks = await feedbackService.getFeedbackByUserId(userId);
    res.status(200).json(feedbacks);
  } catch (error: any) {
    console.error("Error al obtener feedback del usuario:", error);
    res.status(500).json({
      message: "Error al obtener feedback del usuario",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/feedback/{id}/status:
 *   put:
 *     summary: Update feedback status
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved]
 *     responses:
 *       200:
 *         description: Feedback status updated
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Feedback not found
 */
export async function updateFeedbackStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    if (!status || !["pending", "reviewed", "resolved"].includes(status)) {
      res.status(400).json({ message: "Estado inválido" });
      return;
    }

    const updatedFeedback = await feedbackService.updateFeedbackStatus(
      id,
      status
    );

    if (!updatedFeedback) {
      res.status(404).json({ message: "Feedback no encontrado" });
      return;
    }

    res.status(200).json(updatedFeedback);
  } catch (error: any) {
    console.error("Error al actualizar estado del feedback:", error);
    res.status(500).json({
      message: "Error al actualizar estado del feedback",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deleted
 *       404:
 *         description: Feedback not found
 *       400:
 *         description: Invalid ID
 */
export async function deleteFeedback(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;

    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const deletedFeedback = await feedbackService.deleteFeedback(id);

    if (!deletedFeedback) {
      res.status(404).json({ message: "Feedback no encontrado" });
      return;
    }

    res.status(200).json(deletedFeedback);
  } catch (error: any) {
    console.error("Error al eliminar feedback:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar feedback", error: error.message });
  }
}
