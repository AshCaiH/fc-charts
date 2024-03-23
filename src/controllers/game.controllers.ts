import { RequestHandler, response } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { Game, User, UserGames } from "../models";
import { delay } from "../functions/common";
import { fetchRequest } from "../functions/requests";

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
                const newGame = await Game.create(
                    {name: game},
                    {include: User}
                );

                await UserGames.create({UserId: req.user?.id, GameId: newGame.id}); 
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

        sendMessage(res, "Success", {games: games}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const getOCIDs: RequestHandler = async (req, res, next) => {
    try {
        const games = await Game.findAll({where: {ocId: null}});
        const allResults: {game: string, results: any[]}[] = [];

        for (const game of games) {

            const response = await fetchRequest(`https://opencritic-api.p.rapidapi.com/game/search?criteria=${game.name}`)
            .then(async (response) => await response.json())

            allResults.push({
                game: game.name,
                results: response,
            })

            console.log(allResults);
        }

        console.log(allResults);

        sendMessage(res, "Success", {results: allResults}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const setOCIDs: RequestHandler = async (req, res, next) => {
    try {
        const updated: Game[] = [];

        for (const [id, ocId] of Object.entries(req.query)) {
            console.log(ocId);
            const game = await Game.findOne({where: {id: id}});

            await game?.update({"ocId": ocId});
            updated.push(game!);
        }
        
        sendMessage(res, "Success", {updated: updated}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const updateGame = () => {
    return null;
};
