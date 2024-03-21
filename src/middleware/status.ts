import { RequestHandler } from "express";
import { sendError } from "../functions/responses";

export const getStatus: RequestHandler = async (req, res, next) => {
    try {
        
        next();
    } catch (error:any) {
        sendError(req, res, error);
    }
};