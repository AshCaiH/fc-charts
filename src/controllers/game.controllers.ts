import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";

export const addGame: RequestHandler = async (req, res, next) => {
    try {
    
    sendMessage(res, "Success", {}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};

export const searchGame = () => {
    return null;
};

export const updateGame = () => {
    return null;
};