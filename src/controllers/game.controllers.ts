import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { Game } from "../models";
import { delay } from "../functions/common";

export const getGamesFromRaw: RequestHandler = async (req, res, next) => {
    try {
        const games: string[] = [];
        const gameList: string | null = req.body.gameList;

        if (gameList) {            
            const matches = gameList.matchAll(/(?<title>.+?)[\n|\t].+/g);
            for (const match of matches) if (match.groups) games.push(match.groups.title.trim());
        }

        req.gameNames = games;

        next();
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const addGames: RequestHandler = async (req, res, next) => {
    try {
        const rejected: string[] = [];

        for (const game of req.gameNames!) {
            try {
                await Game.create({name: game, UserId: req.user?.id});
            } catch (error:any) {
                rejected.push(game);
            }
        }
    
        sendMessage(res, "Success", {"Not added": rejected}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const listGames: RequestHandler = async (req, res, next) => {
    try {
        const games = await Game.findAll({});

        if (!next) sendMessage(res, "Success", {games: games}, 201);
        else next();
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const getOCIDs: RequestHandler = async (req, res, next) => {
    try {
        const games = await Game.findAll({where: {ocId: null}});
        let results: string[] = [];

        for (const game of games) {
            const url = `https://opencritic-api.p.rapidapi.com/game/search?criteria=${game.name}`;
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
                results.push(result);
                console.log(result);
            } catch (error) {
                console.error(error);
            }

            await delay(250); // Make sure to not make more than 4 reqs a second.
        }

        sendMessage(res, "Success", {games: games}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const updateGame = () => {
    return null;
};