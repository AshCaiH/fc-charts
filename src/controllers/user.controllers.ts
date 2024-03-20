import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import User from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: User;
            gameNames?: string[];
        }
    }
}

export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const user:User = await User.create({
            name: req.body.user.name,
        });

        sendMessage(res, "Success", {user: user.toJSON()}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};

export const listUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await User.findAll({});

        sendMessage(res, "Success", {users: users}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};

export const getUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({where: {name: req.body.user}})        

        if (!user) sendMessage(res, "Could not find matching user.", {}, 404);
        else {
            req.user = user;
            next();
        }
    } catch (error:any) {
        sendError(req, res, error);
    }
};