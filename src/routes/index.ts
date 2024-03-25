import { Router } from "express";
import { fcRequest } from "../functions/fantasycritic";
import { generateChartData } from "../functions/charts";

export {default as user} from "./user.routes";
export {default as game} from "./game.routes";
export {default as review} from "./review.routes";
export {default as status} from "./status.routes";

export const router: Router = Router();

router.get("/fantasycritic", fcRequest);
router.get("/makeCharts", generateChartData)