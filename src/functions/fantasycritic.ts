import { RequestHandler } from "express";
import { sendError, sendMessage } from "./responses"

export const fcRequest: RequestHandler = async (req, res) => {
    try {
        const headers : HeadersInit = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
        }

        const options : RequestInit = {
            method: 'GET',
            headers: headers,
        }

        const url = `https://www.fantasycritic.games/api/League/GetLeagueYear?&leagueID=${process.env.LEAGUE_ID}&year=${process.env.LEAGUE_YEAR}`

        const response = await fetch(url,options)
        .then(async (response) => response.json())
        .then((response) => {
            return response.publishers.map((item:any) => item.playerName)
        });

        sendMessage(res, "Success", {players: response}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};