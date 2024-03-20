import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import User from "../models/user.model";

export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const user:User = await User.create({
            name: req.body.user.name,
        });

        console.log(user);
        sendMessage(res, "Success", {user: user.toJSON()}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};

export const listUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await User.findAll({});

        console.log(users);

        sendMessage(res, "Success", {users: users}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};