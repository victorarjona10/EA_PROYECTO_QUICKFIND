"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_1 = require("../middleware/session");
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = (0, express_1.Router)();
router.post("/", session_1.checkJwt, feedback_controller_1.createFeedback);
router.get("/", session_1.checkJwt, feedback_controller_1.getAllFeedback);
router.get("/:id", session_1.checkJwt, feedback_controller_1.getFeedbackById);
router.get("/user/:userId", session_1.checkJwt, feedback_controller_1.getFeedbackByUserId);
router.put("/:id/status", session_1.checkJwt, feedback_controller_1.updateFeedbackStatus);
router.delete("/:id", session_1.checkJwt, feedback_controller_1.deleteFeedback);
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map