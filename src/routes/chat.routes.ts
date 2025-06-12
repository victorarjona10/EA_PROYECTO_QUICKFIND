import { Router } from "express";
import { checkJwt } from "../middleware/session";
import {
    saveMessage, getMessagesByRoom, getCompanyChats

} from "../controllers/chat.controller";

const router = Router();

// Get message history for a room
router.get("/messages/:roomId", checkJwt, getMessagesByRoom);

// Create a new message (alternative to socket)
router.post("/messages", checkJwt, saveMessage);

// Get all chat rooms for a company
router.get("/rooms/:companyId", checkJwt, getCompanyChats);
export default router;