import { Router } from "express";
import { createUser, listUsers } from "./controllers/user.controllers";

const router: Router = Router();

router.post("/user/create", createUser);
router.get("/user/list", listUsers);

export default router;