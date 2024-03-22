import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { readFile } from 'fs/promises';
import { fetchReviews, filterReviews } from "../functions/reviews";
import { delay } from "../functions/common";
import { Game, Review } from "../models";

export const getReviews: RequestHandler = async (req, res) => {
    try {
        const game = req.game!;
        if (!game.ocId) throw Error(`${game.name} does not have a recorded OpenCritic ID.`)

        const reviews = [];
        let reviewCount = 0;

        do {
            const response = await fetchReviews(game).then(
                async (response) => {
                    const data = await response.json()
                    reviewCount = data.length
                    return filterReviews(data)
                }
            )

            console.log("new reviews: " + reviewCount);
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


export const parseTestData: RequestHandler = async (req, res) => {
    try {
        const testreviews = await readFile("testfiles/yak8reviews.json", "utf8");

        const parsed = filterReviews(JSON.parse(testreviews));
        
        sendMessage(res, "Success", {result: parsed}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};