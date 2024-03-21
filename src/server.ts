import "dotenv/config.js";
import express, { Request, Response, json } from "express";
import { User, Game, UserGames, Review } from "./models";
import * as models from "./models";
import * as routers from "./routes";
import * as types from "./custom"; // Required for custom Request properties.

const port = process.env.PORT || 5001;

const app = express();

app.use(json(), ...Object.values(routers));

app.get("/health", (req:Request, res:Response) => {
    res.status(200).json({message: "API is healthy"});
});

app.listen(port, async () => {
    User.belongsToMany(Game, { through: UserGames });
    Game.belongsToMany(User, { through: UserGames })
    Game.hasMany(Review);

    Object.values(models).forEach(async model => {await model.sync()});
    UserGames.sync();

    console.log(`Server is listening on port ${port}`);
});
