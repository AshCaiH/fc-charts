import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { fetchReviews, filterReviews } from "../functions/reviews";
import { delay } from "../functions/common";
import { Game, Review, Status } from "../models";
import { fetchRequest } from "../functions/requests";
import { Op } from "sequelize";

export const getReviews: RequestHandler = async (req, res) => {
    try {
        if (req.game && !req.game.ocId) throw Error(`${req.game.name} does not have a recorded OpenCritic ID.`)

        const reviews: {name: string, reviewCount: number}[] = [];

        const gameList : Game[] = [];

        if (req.game) gameList.push(req.game);
        else gameList.push(...await Game.findAll({where: {ocId: {[Op.not]: null}}}))

        let message: string = "All game reviews acquired";

        // gameList.forEach(async (game, index) => {
        for (const index in gameList) {
            const game = gameList[index]
            const remainingRequests = await Status.findOne({}).then((response) => response!.requestsRemaining);

            // if (remainingRequests <= 10) {
            //     message = "Ran out of requests."
            //     return;
            // }

            let reviewCount = 0;
            reviews.push({name: game.name, reviewCount: 0});

            do {
                console.log(game.name);

                const response = await fetchRequest(
                        `https://opencritic-api.p.rapidapi.com/reviews/game/${game.ocId}?skip=${game.skipReviews}`
                    ).then(
                    async (response) => {
                        const data = await response.json()
                        reviewCount = data.length
                        return filterReviews(data)
                    }
                )

                response.map((review) => {
                    Review.create({
                        ocId: review.ocId,
                        ocScore: review.ocScore,
                        date: review.date,
                        GameId: game.id,
                    })
                })

                game.skipReviews += reviewCount;
                reviews[index].reviewCount += reviewCount;
                
                if (reviewCount == 20) await delay(250);
            } while (reviewCount == 20);
            
            await Game.update({skipReviews: game.skipReviews}, {where: {id: game.id}});
        };
        
        sendMessage(res, message, {reviews: reviews}, 201);
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