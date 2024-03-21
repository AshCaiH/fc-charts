import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";

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