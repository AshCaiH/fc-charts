import { RequestHandler } from "express";
import { sendError, sendMessage } from "./responses"
import { Game, User, UserGames } from "../models";

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
            const users: User[] = [];
            const games: Game[] = [];

            response.publishers.forEach(async (publisher:any) => {
                const [user, exists] = await User.findOrCreate({where: {id: publisher.userID}})
                user.publisherName = ""; // Errors when hitting non-unicode names, dummied out for now.
                user.name = publisher.playerName;
                user.save();
                users.push(user.toJSON());

                publisher.games.forEach(async (published:any) => {
                    const [game, exists] = await Game.findOrCreate({where: {id: published.masterGame.masterGameID}})
                    game.ocId = published.masterGame.openCriticID;
                    game.name = published.masterGame.gameName;
                    game.ocScore = published.masterGame.criticScore;
                    game.releaseDate = published.masterGame.releaseDate;

                    await UserGames.findOrCreate({where: {UserId: user.id, GameId: game.id, counterpicked: published.counterPick}});

                    game.save();
                    games.push(game.toJSON());
                });

            });

            return {users: users, games: games};
        });

        sendMessage(res, "Success", response, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};