import { Router } from "express";
import { addGames, getGamesFromRaw, getOCIDs, listGames, setOCIDs } from "../controllers/game.controllers";
import { getUser } from "../controllers/user.controllers";

const gameRouter: Router = Router();

gameRouter.post("/games/addraw", getUser, getGamesFromRaw, addGames);
gameRouter.get("/games/list", listGames);

gameRouter.get("/games/getOCID", getOCIDs);
gameRouter.put("/games/setOCID", setOCIDs);

export default gameRouter;