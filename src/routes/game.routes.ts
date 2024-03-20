import { Router } from "express";
import { addGames, getGamesFromRaw, listGames } from "../controllers/game.controllers";
import { getUser } from "../controllers/user.controllers";

const gameRouter: Router = Router();

gameRouter.post("/games/addraw", getUser, getGamesFromRaw, addGames);
gameRouter.post("/games/list", listGames);

export default gameRouter;