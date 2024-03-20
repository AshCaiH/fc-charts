import { Router } from "express";
import { addGames, getGamesFromRaw, getOCIDs, listGames } from "../controllers/game.controllers";
import { getUser } from "../controllers/user.controllers";

const gameRouter: Router = Router();

gameRouter.post("/games/addraw", getUser, getGamesFromRaw, addGames);
gameRouter.get("/games/list", listGames);

gameRouter.put("/games/getOCID", getOCIDs);

export default gameRouter;