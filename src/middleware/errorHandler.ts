// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apperror";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  return res.status(statusCode).json({
     message: err.message || "Internal Server Error" 
  });
};
