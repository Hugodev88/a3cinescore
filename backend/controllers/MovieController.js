const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');
const Review = require('../models/Review');
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

    // Método para buscar filmes pelo nome
    static async searchMovie(req, res) {
        const inputValue = req.query.name; // Pega o parâmetro "name" da query string
    
        if (!inputValue || typeof inputValue !== 'string' || inputValue.trim() === '') {
            return res.status(400).json({ message: "Por favor, forneça um nome de filme válido para buscar." });
        }
    
        try {
            // Utiliza uma expressão regular para procurar filmes com o nome fornecido
            const movies = await Movie.find({ 
                title: { 
                    $regex: inputValue.trim(),  // Usando trim para remover espaços extras
                    $options: 'i'  // Ignora diferenças de maiúsculas/minúsculas
                }
            });
    
            // if (movies.length === 0) {
            //     return res.status(404).json({ message: "Nenhum filme encontrado." });
            // }
    
            res.status(200).json(movies); // Retorna os filmes encontrados
        } catch (error) {
            console.error('Erro ao buscar filmes:', error.message);
            res.status(500).json({ message: error.message || 'Erro ao buscar filmes.' });
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
        const { title, description, releaseDate, director, genre } = req.body;
    
        try {
            const movie = await Movie.findById(movieId);
    
            if (!movie) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }
    
            // Atualiza os campos do filme, se forem fornecidos
            movie.title = title || movie.title;
            movie.description = description || movie.description;
            movie.releaseDate = releaseDate || movie.releaseDate;
            movie.director = director || movie.director;
            movie.genre = genre || movie.genre;
    
            // Se houver uma foto, atualiza
            if (req.file) {
                movie.photo = req.file.filename;
            }
    
            await movie.save();
            res.status(200).json({ message: 'Filme atualizado com sucesso', movie });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao editar filme' });
        }
    }

    // Método para deletar um filme
    static async deleteMovie(req, res) {
        const movieId = req.params.id;

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

            if (movie.user._id.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Você não tem permissão para excluir este filme' });
            }

            await movie.remove();

            res.status(200).json({ message: 'Filme removido com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erro ao excluir filme' });
        }
    }

    // Método para buscar as avaliacoes de um filme
    static async getMovieReviews(req, res) {

        try {
            const movieId  = req.params.id;

            const reviews = await Review.find({"movie": movieId }).sort('-createdAt');

            res.status(200).json({ reviews });
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar avaliações do filme" });
        }
    }
};
