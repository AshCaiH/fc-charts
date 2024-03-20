import "dotenv/config.js";
import express, { Request, Response, json } from "express";
import { User, Game, Review } from "./models";
import * as models from "./models";
import * as routers from "./routes";

const port = process.env.PORT || 5001;

const app = express();

app.use(json(), ...Object.values(routers));

app.get("/health", (req:Request, res:Response) => {
    res.status(200).json({message: "API is healthy"});
});

app.listen(port, async () => {
    User.hasMany(Game);
    Game.hasMany(Review);

    Object.values(models).forEach(model => {
        model.sync();
    });

    console.log(`Server is listening on port ${port}`);
});
