import "dotenv/config.js";
import express, { Request, Response, json } from "express";

const port = process.env.PORT || 5001;

const app = express();

app.use(json());

app.get("/health", (req:Request, res:Response) => {
    res.status(200).json({message: "API is healthy"});
});

app.listen(port, async () => {
    console.log(`Server is listening on port ${port}`);
});
