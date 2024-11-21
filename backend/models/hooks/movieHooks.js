// models/hooks/movieHooks.js
const Review = require('../Review'); // Importa o modelo de Review

async function calculateAverageScore(movie) {
    if (movie.reviews && movie.reviews.length > 0) {
        const reviews = await Review.find({ _id: { $in: movie.reviews } });
        const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
        movie.averageScore = totalScore / reviews.length;
    } else {
        movie.averageScore = 0; // Define média como 0 se não houver avaliações
    }
}

module.exports = { calculateAverageScore };
