import { RequestHandler } from "express";
import { sendError } from "../functions/responses";
import { Game } from "../models";

export const getGameById: RequestHandler = async (req, res, next) => {
    try {
        const game = await Game.findOne({where: {id: req.params["gameId"]}})

        if (!game) throw Error("No game found by that ID");

        req.game = game;
        next();
    } catch (error:any) {
        sendError(req, res, error);
    }
};