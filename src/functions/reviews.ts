export const filterReviews = (reviews: any[]) => {

    console.log(reviews);
    
    reviews = reviews.filter((review) => {
        if (review.Outlet.isContributor) return false;
        if (!review.ScoreFormat.isNumeric) return false;
        if (!review.score) return false;
        return true;
    });

    console.log(reviews);

    return reviews.map(function(review) {
        return {
            ocId: review._id,
            date: review.createdAt,
            ocScore: review.score,
        }
    });

};