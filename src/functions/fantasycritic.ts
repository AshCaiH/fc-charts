import { RequestHandler } from "express";
import { sendError, sendMessage } from "./responses"
import { User } from "../models";

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

            response.publishers.forEach(async (publisher:any) => {
                const [user, exists] = await User.findOrCreate({where: {id: publisher.userID}})
                user.publisherName = ""; // Errors when hitting non-unicode names, dummied out for now.
                user.name = publisher.playerName;
                user.save();

                users.push(user);
            });

            return users;
        });

        sendMessage(res, "Success", {players: response}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};