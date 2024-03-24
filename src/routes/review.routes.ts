import { Router } from "express";
import { getGameById } from "../middleware/games";
import { getReviews, reviewsTest } from "../controllers/review.controllers";

const reviewRouter: Router = Router();

reviewRouter.get("/reviews/:gameId", getGameById, getReviews);

reviewRouter.get("/reviewsTest/:gameId", reviewsTest);

export default reviewRouter;