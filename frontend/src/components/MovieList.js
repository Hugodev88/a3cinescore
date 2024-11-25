// src/components/MovieList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './MovieList.css'; // Importa o CSS personalizado

const MovieList = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('/movies');
                setMovies(response.data);
            } catch (error) {
                console.error("Erro ao buscar filmes:", error);
            }
        };
        fetchMovies();
    }, []);

    if (movies.length === 0) return <p>Não há filmes disponíveis.</p>;

    return (
        <div className="movie-container">
            <div className="movie-grid">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        {movie.photo && (
                            <img
                                src={`${process.env.REACT_APP_API}/images/movies/${movie.photo}`}
                                className="movie-img"
                                alt={`Poster de ${movie.title}`}
                                onError={() => console.error(`Erro ao carregar a imagem: ${movie.photo}`)}
                            />
                        )}
                        <div className="card-body">
                            <h5 className="card-title">{movie.title}</h5>
                            <p className="card-text">{movie.director}</p>
                            <div className="actions">
                                <Link to={`/movies/${movie._id}`} className="btn">
                                    Ver mais
                                </Link>
                                <Link to={`/review/${movie._id}`} className="btn">
                                    Avaliar
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;
