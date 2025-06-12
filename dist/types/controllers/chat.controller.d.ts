import { Request, Response } from "express";
import { RequestExt } from "../middleware/session";
export declare function getMessagesByRoom(req: Request, res: Response): Promise<void>;
export declare function saveMessage(req: RequestExt, res: Response): Promise<void>;
export declare function getCompanyChats(req: Request, res: Response): Promise<void>;
