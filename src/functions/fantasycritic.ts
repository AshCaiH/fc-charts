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
        .then(async (response) => await response.json())
        .then(async (response) => {
            const updatedGames: any[] = [];
            const updatedUsers: any[] = [];

            response.publishers.map(async(publisher:any) => {
                const [user, userExists] = await User.findOrBuild({
                    where: {id: publisher.userID}
                })

                if (!userExists || user.name != publisher.playerName) {
                    user.name == publisher.playerName;
                    updatedUsers.push(user.name);
                    user.save();
                }                

                publisher.games.map(async (publishedGame:any) => {

                    const [game, gameExists] = await Game.findOrBuild({
                        where: {id: publishedGame.masterGame.masterGameID}
                    });

                    const updateGame = (localkey: string, remotekey: string) => {
                        if (game.get(localkey) != publishedGame.masterGame[remotekey]) {
                            console.log(`Updating ${localkey} of ${game.name}:`, game.get(localkey), "->", publishedGame.masterGame[remotekey]);
                            game.set(localkey, publishedGame.masterGame[remotekey]);
                            return 1;
                        } else return 0;
                    }

                    let changedValues = 0;

                    changedValues += updateGame("name", "gameName");
                    changedValues += updateGame("ocScore", "criticScore");
                    // changedValues += updateGame("releaseDate", "releaseDate");

                    if (!gameExists || changedValues > 1) {
                        updatedGames.push(game.toJSON);
                        game.save();
                    }

                });
            });

            console.log("Games", updatedUsers);

            return {users: updatedUsers, games: updatedGames};
        });

        sendMessage(res, "Success", response, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};

export const convertScore = (score:number) => {
    const divmod = (x: number, y: number) => [Math.floor(x / y), x % y];

    let convertedScore = score - 70;

    if (60 <= score && score < 90) return convertedScore;
    
    if (score > 90) {
        const overScore = (score - 90) * 2;
        return 20 + overScore;
    } else if (score < 60) {
        const [steps, remainder] = divmod(60 - score, 10);
        let total = 10;

        const array = Array(steps).fill(10);
        array.push(remainder);
        array.map((item, step) => {total += item / (2 ** (step+1))});

        return -total;
    }
}
