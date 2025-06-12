"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_1 = require("../middleware/session");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.get("/messages/:roomId", session_1.checkJwt, chat_controller_1.getMessagesByRoom);
router.post("/messages", session_1.checkJwt, chat_controller_1.saveMessage);
router.get("/rooms/:companyId", session_1.checkJwt, chat_controller_1.getCompanyChats);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map