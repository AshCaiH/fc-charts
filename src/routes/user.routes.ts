import { Router } from "express";
import { createUser, listUsers } from "../controllers/user.controllers";

const userRouter: Router = Router();

userRouter.post("/user/create", createUser);
userRouter.get("/user/list", listUsers);

export default userRouter;