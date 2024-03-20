import "dotenv/config.js";
import express, { Request, Response, json } from "express";
import router from "./routes";
import User from "./models/user.model";
import Game from "./models/game.model";
import Review from "./models/review.model";
import Status from "./models/status.model";

const port = process.env.PORT || 5001;

const app = express();

app.use(json(), router);

app.get("/health", (req:Request, res:Response) => {
    res.status(200).json({message: "API is healthy"});
});

app.listen(port, async () => {
    User.hasMany(Game);
    Game.hasMany(Review);

    User.sync();
    Game.sync(); // Use { alter: true } while working on model but REMOVE when done.
    Review.sync();
    Status.sync();

    console.log(`Server is listening on port ${port}`);
});
