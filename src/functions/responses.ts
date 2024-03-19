import { Request, Response } from "express";

export const sendError = (req:Request, res:Response, error:Error) => {
    res.status(500).json({
        message: error.message,
        error: error,
    });
}

export const sendMessage = (res:Response, message:string, extra?:any, status?:number) => {
    res.status(status || 200).json({
        message: message,
        extra: extra
    });
}