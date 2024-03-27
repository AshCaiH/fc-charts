import { Router } from "express";
import { getGameById } from "../middleware/games";
import { getReviews } from "../controllers/review.controllers";

const reviewRouter: Router = Router();

reviewRouter.get("/reviews/getAll", getReviews);
reviewRouter.get("/reviews/:gameId", getGameById, getReviews);

export default reviewRouter;