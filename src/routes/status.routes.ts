import { Router } from "express";
import { Status } from "../models";
import { sendMessage } from "../functions/responses";

const statusRouter: Router = Router();

statusRouter.get("/status", (req, res, next) => {
    Status.findAll({}).then(
        (response) => sendMessage(res, "Success", {response}, 201)
    )
});

export default statusRouter;