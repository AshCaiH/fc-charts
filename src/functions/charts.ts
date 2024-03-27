import { RequestHandler } from "express";
import { sendError, sendMessage } from "./responses";
import { Game, Review, User, UserGames } from "../models";
import { Op } from "sequelize";
import { convertScore } from "./fantasycritic";

export const generateChartData: RequestHandler = async (req, res) => {
    try {
        const users = await User.findAll({});
        const result: any[] = [];

        for (const user of users) {
            const userGames = await Game.findAll({        
                where: {ocScore: {[Op.ne]: null}},    
                include: {
                    model: User,
                    where: {id: user.id}
                }
            });

            const games: any[] = [];

            for (const game of userGames) {
                const gameReviews = await Review.findAll({
                    where: {GameId: game.id}
                }).then(async (item) => {
                    let runningTotal = 0;

                    const counterpicked = await UserGames.findOne({
                        where: {
                            UserId: user.id,
                            GameId: game.id,
                            counterpicked: true,
                        }
                    }).then(response => {
                        // Sequelize doesn't seem to like reading tinyints, so
                        // use this slightly hacky workaround to get counterpicks.
                        if (!response) return false;
                        return true;
                    });

                    const parsedData = item.map((item, index) => {
                        runningTotal += item.ocScore;
                        const ocAverage = runningTotal / (index + 1);
                        const fcAverage = convertScore(ocAverage);

                        return {ocAverage: ocAverage, fcAverage: fcAverage, date: item.date};
                    });

                    return {game: game.name, counterpicked: counterpicked, data: parsedData}
                });

                games.push(gameReviews);
            }

            result.push({user: user.name, games: games});
        }
        
        sendMessage(res, "Retrieved reviews for user", {result: result}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};