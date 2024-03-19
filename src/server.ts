import "dotenv/config.js";
import express, { Request, Response, json } from "express";

const app = express();

app.use(json());

app.get("/health", (req:Request, res:Response) => {
    res.status(200).json({message: "API is healthy"});
});

app.listen(5000, async () => {
    console.log("Server is listening on port 5000");
});