import { Response } from "express";
export declare const sendSuccess: (res: Response, data: any, message?: string, status?: number) => Response<any, Record<string, any>>;
