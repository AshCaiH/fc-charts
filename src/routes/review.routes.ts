import { Router } from "express";
import { getGameById } from "../middleware/games";
import { getReviews, parseTestData } from "../controllers/review.controllers";

const reviewRouter: Router = Router();

reviewRouter.get("/reviews/:gameId", getGameById, getReviews);

reviewRouter.get("/testreviewparse", parseTestData);

export default reviewRouter;