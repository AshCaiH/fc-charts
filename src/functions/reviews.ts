import { Game } from "../models";

export const filterReviews = (reviews: any[]) => {
    
    reviews = reviews.filter((review: any) => {
        if (review.Outlet.isContributor) return false;
        if (!review.ScoreFormat.isNumeric) return false;
        if (!review.score) return false;
        return true;
    });

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
    const headers : HeadersInit = {
        'X-RapidAPI-Key': process.env.OC_APIKEY!,
        'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
    }

    const options : RequestInit = {
        method: 'GET',
        headers: headers,
    };    

    const response = await fetch(url, options);
    console.log("remaining requests: " + response.headers.get("x-ratelimit-requests-remaining"));
    
    return response;
}