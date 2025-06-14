import { Router } from "express";
import { checkJwt } from "../middleware/session";
import {
  getNotifications,
  markNotificationAsRead,
  clearAllNotifications,
  readNotifications,
} from "../controllers/notification.controller";

const router = Router();

router.get("/", checkJwt, getNotifications);
router.put("/:id/read", checkJwt, markNotificationAsRead);
router.post("/clear", checkJwt, clearAllNotifications);
router.put("/read-all", checkJwt, readNotifications);
//router.put("/read-all", checkJwt, readNotifications);

export default router;
