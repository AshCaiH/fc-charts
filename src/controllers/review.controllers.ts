import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { fetchReviews, filterReviews } from "../functions/reviews";
import { delay } from "../functions/common";
import { Game, Review } from "../models";
import { fetchRequest } from "../functions/requests";

export const getReviews: RequestHandler = async (req, res) => {
    try {
        const game = req.game!;
        if (!game.ocId) throw Error(`${game.name} does not have a recorded OpenCritic ID.`)

        const reviews = [];
        let reviewCount = 0;

        do {
            const response = await fetchRequest(
                    `https://opencritic-api.p.rapidapi.com/reviews/game/${game.ocId}?skip=${game.skipReviews}`
                ).then(
                async (response) => {
                    const data = await response.json()
                    reviewCount = data.length
                    return filterReviews(data)
                }
            )

            reviews.push(...response);

            response.map((review) => {
                Review.create({
                    ocId: review.ocId,
                    ocScore: review.ocScore,
                    date: review.date,
                    GameId: game.id,
                })
            })

            game.skipReviews += reviewCount;
            
            if (reviewCount == 20) await delay(250);
        } while (reviewCount == 20);

        await Game.update({skipReviews: game.skipReviews}, {where: {id: game.id}});
        
        sendMessage(res, "Success", {reviews: reviews}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};


export const reviewsTest: RequestHandler = async (req, res) => {
    try {
        const reviews = await Review.findAll({where: {GameId: req.params["gameId"]}});
        const average = reviews.map((review) => review.ocScore).reduce((acc, curr) => acc + curr) / reviews.length;

        sendMessage(res, `Average score is ${average}`, {}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};