"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = createFeedback;
exports.getAllFeedback = getAllFeedback;
exports.getFeedbackById = getFeedbackById;
exports.getFeedbackByUserId = getFeedbackByUserId;
exports.updateFeedbackStatus = updateFeedbackStatus;
exports.deleteFeedback = deleteFeedback;
const feedback_service_1 = require("../services/feedback.service");
const feedbackService = new feedback_service_1.FeedbackService();
function createFeedback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const feedback = req.body;
            if (!feedback.title ||
                !feedback.message ||
                !feedback.type ||
                !feedback.user_id) {
                res.status(400).json({
                    message: "Título, mensaje, tipo y ID de usuario son obligatorios",
                });
                return;
            }
            if (!["error", "suggestion", "rating"].includes(feedback.type)) {
                res.status(400).json({ message: "Tipo de feedback inválido" });
                return;
            }
            if (feedback.type === "rating" &&
                (feedback.rating === undefined ||
                    feedback.rating < 1 ||
                    feedback.rating > 5)) {
                res
                    .status(400)
                    .json({ message: "La valoración debe ser un número entre 1 y 5" });
                return;
            }
            feedback.created_at = new Date();
            const newFeedback = yield feedbackService.createFeedback(feedback);
            res.status(201).json(newFeedback);
        }
        catch (error) {
            console.error("Error al crear feedback:", error);
            res
                .status(500)
                .json({ message: "Error al crear feedback", error: error.message });
        }
    });
}
function getAllFeedback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const feedbacks = yield feedbackService.getAllFeedback(page, limit);
            res.status(200).json(feedbacks);
        }
        catch (error) {
            console.error("Error al obtener feedback:", error);
            res
                .status(500)
                .json({ message: "Error al obtener feedback", error: error.message });
        }
    });
}
function getFeedbackById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const feedback = yield feedbackService.getFeedbackById(id);
            if (!feedback) {
                res.status(404).json({ message: "Feedback no encontrado" });
                return;
            }
            res.status(200).json(feedback);
        }
        catch (error) {
            console.error("Error al obtener feedback:", error);
            res
                .status(500)
                .json({ message: "Error al obtener feedback", error: error.message });
        }
    });
}
function getFeedbackByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            if (!userId || userId.length !== 24) {
                res.status(400).json({ message: "ID de usuario inválido" });
                return;
            }
            const feedbacks = yield feedbackService.getFeedbackByUserId(userId);
            res.status(200).json(feedbacks);
        }
        catch (error) {
            console.error("Error al obtener feedback del usuario:", error);
            res.status(500).json({
                message: "Error al obtener feedback del usuario",
                error: error.message,
            });
        }
    });
}
function updateFeedbackStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const updatedFeedback = yield feedbackService.updateFeedbackStatus(id, status);
            if (!updatedFeedback) {
                res.status(404).json({ message: "Feedback no encontrado" });
                return;
            }
            res.status(200).json(updatedFeedback);
        }
        catch (error) {
            console.error("Error al actualizar estado del feedback:", error);
            res.status(500).json({
                message: "Error al actualizar estado del feedback",
                error: error.message,
            });
        }
    });
}
function deleteFeedback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const deletedFeedback = yield feedbackService.deleteFeedback(id);
            if (!deletedFeedback) {
                res.status(404).json({ message: "Feedback no encontrado" });
                return;
            }
            res.status(200).json(deletedFeedback);
        }
        catch (error) {
            console.error("Error al eliminar feedback:", error);
            res
                .status(500)
                .json({ message: "Error al eliminar feedback", error: error.message });
        }
    });
}
//# sourceMappingURL=feedback.controller.js.map