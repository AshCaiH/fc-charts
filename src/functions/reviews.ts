import { Game } from "../models";
import { delay } from "./common";
import { fetchRequest } from "./requests";

export const filterReviews = (reviews: any[]) => {
    
    try {
        reviews = reviews.filter((review: any) => {
            if (review.Outlet.isContributor) return false;
            if (!review.ScoreFormat.isNumeric) return false;
            if (!review.score) return false;
            return true;
        });
    } catch (e) {
        console.log(e)
    }

    return reviews.map(function(review) {
        return {
            ocId: review._id,
            date: review.createdAt,
            ocScore: review.score,
        }
    });

};

export const fetchReviews = async (game: Game) : Promise<Response> => {

    const url = `https://opencritic-api.p.rapidapi.com/reviews/game/${game.ocId}?skip=${game.skipReviews}`;
    const response = await fetchRequest(url);
    
    return response;
}