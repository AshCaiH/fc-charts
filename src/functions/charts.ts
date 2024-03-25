import { RequestHandler } from "express";
import { sendError, sendMessage } from "./responses";
import { Game, Review, User } from "../models";
import { Op } from "sequelize";
import { convertScore } from "./fantasycritic";

export const generateChartData: RequestHandler = async (req, res) => {
    try {
        const userGames = await Game.findAll({        
            where: {ocScore: {[Op.ne]: null}},    
            include: {
                model: User,
                where: {name: process.env.TEST_USER}
            }
        });

        const userReviews: any[] = [];

        for (const game of userGames) {
            console.log(game.id);
            const gameReviews = await Review.findAll({
                where: {GameId: game.id}
            }).then(item => {
                let runningTotal = 0;

                const parsedData = item.map((item, index) => {
                    runningTotal += item.ocScore;
                    const ocAverage = runningTotal / (index + 1);
                    const fcAverage = convertScore(ocAverage);

                    return {ocAverage: ocAverage, fcAverage: fcAverage, date: item.date};
                });

                return {game: game.name, data: parsedData}
            });

            userReviews.push(gameReviews);
        }
        
        sendMessage(res, "Retrieved reviews for user", {result: userReviews}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};