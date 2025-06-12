import { Response } from "express";

export const sendSuccess = (res: Response, data: any, message = "Operación exitosa", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};
