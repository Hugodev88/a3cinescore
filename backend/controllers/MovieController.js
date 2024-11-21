const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

module.exports = class MovieController {

    // Método para exibir todos os filmes
    static async showMovies(req, res) {
        try {
            const movies = await Movie.find().sort('-createdAt');
            res.status(200).json( movies );
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao carregar filmes' });
        }
    }

    // Método para adicionar um novo filme
    static async addMovie(req, res) {
        const { title, description, releaseDate, director, genre } = req.body;
        const photo = req.file ? req.file.filename : '';  // Se não houver foto, mantém vazio

        // Validação dos campos obrigatórios
        if (!title || !description || !releaseDate || !director || !genre) {
            return res.status(422).json({ message: 'Todos os campos são obrigatórios' });
        }

        try {
            const token = getToken(req);
            const user = await getUserByToken(token);

            if (!user) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            // Criação do filme
            const movie = new Movie({
                title,
                description,
                releaseDate,
                director,
                genre,
                photo,
            });

            const newMovie = await movie.save();

            
            res.status(201).json({ message: 'Filme cadastrado com sucesso', newMovie });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao adicionar filme' });
        }
    }

    // Método para buscar um filme pelo id
    static async getMovieById(req, res) {
        const movieId = req.params.id;

        // Verificação do ID de filme
        if (!ObjectId.isValid(movieId)) {
            return res.status(422).json({ message: 'Id de filme inválido' });
        }

        try {
            const movie = await Movie.findById(movieId);

            if (!movie) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }

            res.status(200).json({ movie });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao buscar filme' });
        }
    }

    // Método para editar um filme
    static async editMovie(req, res) {
        const movieId = req.params.id;

        // Verificação do ID de filme
        if (!ObjectId.isValid(movieId)) {
            return res.status(422).json({ message: 'Id de filme inválido' });
        }

        try {
            const movie = await Movie.findById(movieId);

            if (!movie) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }

            // Verificar se o usuário autenticado tem permissão para editar o filme
            const token = getToken(req);
            const user = await getUserByToken(token);

            // Apenas o usuário que criou o filme ou administrador pode editá-lo
            if (movie.user._id.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Você não tem permissão para editar este filme' });
            }

            // Atualiza os campos do filme
            const { title, description, releaseDate, director, genre } = req.body;
            const photo = req.file ? req.file.filename : movie.photo;  // Atualiza foto, se houver

            if (title) movie.title = title;
            if (description) movie.description = description;
            if (releaseDate) movie.releaseDate = releaseDate;
            if (director) movie.director = director;
            if (genre) movie.genre = genre;
            movie.photo = photo;

            const updatedMovie = await movie.save();
            res.status(200).json({ message: 'Filme atualizado com sucesso', updatedMovie });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao editar filme' });
        }
    }

    // Método para deletar um filme
    static async deleteMovie(req, res) {
        const movieId = req.params.id;

        // Verificação do ID de filme
        if (!ObjectId.isValid(movieId)) {
            return res.status(422).json({ message: 'Id de filme inválido' });
        }

        try {
            const movie = await Movie.findById(movieId);

            if (!movie) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }

            const token = getToken(req);
            const user = await getUserByToken(token);

            // Verificar se o usuário autenticado tem permissão para deletar o filme
            if (movie.user._id.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Você não tem permissão para excluir este filme' });
            }

            // Exclui o filme
            await movie.remove();

            res.status(200).json({ message: 'Filme removido com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao excluir filme' });
        }
    }
};
