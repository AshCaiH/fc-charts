import { RequestHandler } from "express";
import { sendError, sendMessage } from "../functions/responses";
import { fetchReviews, filterReviews } from "../functions/reviews";
import { delay } from "../functions/common";
import { Game, Review, Status } from "../models";
import { fetchRequest } from "../functions/requests";
import { Op } from "sequelize";

const log = require('single-line-log').stdout;

const reviewRequestLoop = async(gameList: Game[], reviews: {name: string, reviewCount: number}[]) => {    
    let leftovers: Game[] = [];

    for (const [index, game] of gameList.entries()) {
        // const remainingRequests = await Status.findOne({}).then((response) => response!.requestsRemaining);

        const progressBarLength: number = 20;
        const progressAmt = Math.floor(progressBarLength * (index / gameList.length))


        log(`Retrieving reviews for ${game.name}\n${"▓".repeat(progressAmt) + "▒".repeat(progressBarLength - progressAmt)}`);

        // if (remainingRequests <= 10) {
        //     message = "Ran out of requests."
        //     break;
        // }

        let reviewCount = 0;
        reviews.push({name: game.name, reviewCount: 0});

        do {
            const response = await fetchRequest(
                    `https://opencritic-api.p.rapidapi.com/reviews/game/${game.ocId}?skip=${game.skipReviews}`
                ).then(
                async (response) => {
                    const data = await response.json()
                    reviewCount = data.length
                    game.lastChecked = new Date(Date.now());
                    return filterReviews(data)
                }
            )

            response.forEach(async (review) => {
                const exists = await Review.findOne({where: {ocId: review.ocId}});

                if (exists) {
                    log("");
                    console.log(`${game.name} has extra uncounted reviews. Wiping all reviews for the game.`);
                    Review.destroy({where: {GameId: game.id}});
                    game.skipReviews = 0;
                    await game.save();
                    leftovers.push(game);
                    return;
                }

                game.lastUpdated = new Date(Date.now());

                await Review.create({
                    ocId: review.ocId,
                    ocScore: review.ocScore,
                    date: review.date,
                    GameId: game.id,
                })
                
                return;
            })

            game.skipReviews += reviewCount;
            reviews[index].reviewCount += reviewCount;
            
            if (reviewCount == 20) await delay(250);
        } while (reviewCount == 20);
        
        await game.save();
    };

    return leftovers;
}

export const getReviews: RequestHandler = async (req, res) => {
    try {
        if (req.game && !req.game.ocId) throw Error(`${req.game.name} does not have a recorded OpenCritic ID.`)

        const reviews: {name: string, reviewCount: number}[] = [];

        const gameList : Game[] = [];

        if (req.game) gameList.push(req.game);
        else gameList.push(...await Game.findAll({where: {ocId: {[Op.not]: null}, ocScore: {[Op.not]: null}}}))

        let message: string = "All game reviews acquired";

        let reruns = await reviewRequestLoop(gameList, reviews);
        await reviewRequestLoop(reruns, reviews);
        
        const remainingRequests = await Status.findOne({}).then((response) => response!.requestsRemaining);
        log("");
        console.log(`Review update completed. ${remainingRequests} requests remaining.`);
        
        sendMessage(res, message, {reviews: reviews.filter(review => review.reviewCount > 0)}, 201);
    } catch (error:any) {
        sendError(req, res, error);
    }
};
