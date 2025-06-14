import { Request, Response } from "express";
export declare function getNotifications(req: Request, res: Response): Promise<void>;
export declare function markNotificationAsRead(req: Request, res: Response): Promise<void>;
export declare function clearAllNotifications(req: Request, res: Response): Promise<void>;
export declare function readNotifications(req: Request, res: Response): Promise<void>;
