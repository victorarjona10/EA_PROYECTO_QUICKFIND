"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_1 = require("../middleware/session");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
router.get("/", session_1.checkJwt, notification_controller_1.getNotifications);
router.put("/:id/read", session_1.checkJwt, notification_controller_1.markNotificationAsRead);
router.post("/clear", session_1.checkJwt, notification_controller_1.clearAllNotifications);
router.put("/read-all", session_1.checkJwt, notification_controller_1.readNotifications);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map