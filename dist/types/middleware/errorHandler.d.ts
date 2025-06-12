import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apperror";
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
