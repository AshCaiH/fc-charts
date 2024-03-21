import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { readFile } from 'fs/promises';
import { filterReviews } from "../functions/reviews";

export const getReviews: RequestHandler = async (req, res) => {
    try {
        const game = req.game!;
        if (!game.ocId) throw Error(`${game.name} does not have a recorded OpenCritic ID.`)

        const url = `https://opencritic-api.p.rapidapi.com/reviews/game/${game.ocId}?skip=${game.skipReviews}`;
        const headers : HeadersInit = {
            'X-RapidAPI-Key': process.env.OC_APIKEY!,
            'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
        }

        const options : RequestInit = {
            method: 'GET',
            headers: headers,
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);

            sendMessage(res, "Success", {response: response}, 201);
        } catch (error) {
            console.error(error);
        }

        // await delay(250);
        
        // sendMessage(res, "Success", {}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const parseTestData: RequestHandler = async (req, res) => {
    try {
        const testreviews = await readFile("testfiles/yak8reviews.json", "utf8");

        const parsed = filterReviews(JSON.parse(testreviews));
        console.log(parsed);
        
        sendMessage(res, "Success", {result: parsed}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};