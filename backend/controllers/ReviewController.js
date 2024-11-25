const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const User = require('../models/User');
const { ObjectId } = mongoose.Types;


module.exports = class ReviewController {

    // Método para exibir todas as avaliações
    static async showReviews(req, res) {
        try {
            const reviews = await Review.find().sort('-createdAt');
            res.status(200).json({ reviews });
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar avaliações" });
        }
    }

    // Método para adicionar uma avaliação
    static async addReview(req, res) {
        const { title, score, review, movieId } = req.body;

        // Verifica se todos os campos necessários estão presentes
        if (!title || !score || !review || !movieId) {
            return res.status(422).json({ message: "Todos os campos são obrigatórios" });
        }

        try {
            // Verifica se o usuário está autenticado
            const userAuthenticated = await getUserByToken(getToken(req));
            if (!userAuthenticated) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            

            const user = await User.findById(userAuthenticated);

            // Encontra o filme pelo movieId
            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: "Filme não encontrado" });
            }

            // Cria a nova avaliação
            const newReview = new Review({
                title,
                score,
                review,
                movie: { _id: movie._id, name: movie.title },
                user: { _id: user._id, name: user.name }
            });

            // Salva a avaliação
            await newReview.save();

            // Atualiza o filme e o usuário com a nova avaliação
            movie.reviews.push(newReview._id);
            user.reviews.push(newReview._id);

            await movie.save();
            await user.save();

            return res.status(201).json({ message: "Avaliação criada com sucesso", newReview });

        } catch (error) {
            console.error("Erro ao adicionar avaliação:", error);
            return res.status(500).json({ message: "Erro ao adicionar avaliação" });
        }


    }

    // Método para atualizar uma avaliação
    static async editReview(req, res) {
        const id = req.params.id;
        const { title, score, review } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "ID inválido." });
        }

        try {
            const reviewToUpdate = await Review.findById(id);
            if (!reviewToUpdate) {
                return res.status(404).json({ message: "Avaliação não encontrada." });
            }

            if (title) reviewToUpdate.title = title;
            if (score) reviewToUpdate.score = score;
            if (review) reviewToUpdate.review = review;

            const updatedReview = await reviewToUpdate.save();
            res.status(200).json({ message: "Avaliação atualizada com sucesso", updatedReview });
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar avaliação" });
        }
    }

    // Método para deletar uma avaliação
    static async deleteReview(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "ID inválido" });
        }

        try {
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({ message: "Avaliação não encontrada" });
            }

            const token = getToken(req);
            const user = await getUserByToken(token);

            if (review.user._id.toString() !== user._id.toString()) {
                return res.status(403).json({ message: "Você não tem permissão para deletar esta avaliação" });
            }

            await Review.findByIdAndDelete(id);
            res.status(200).json({ message: "Avaliação deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar avaliação" });
        }
    }

    // Método para buscar uma avaliação pelo ID
    static async getReviewById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "ID inválido" });
        }

        try {
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({ message: "Avaliação não encontrada" });
            }

            res.status(200).json({ review });
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar avaliação" });
        }
    }
};
