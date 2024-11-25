import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import './MoviePage.css'; // Importe a folha de estilos
import { format } from 'date-fns';

function MoviePage() {
    const [movie, setMovie] = useState({});
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get(`/movies/${id}`)
            .then((response) => {
                setMovie(response.data.movie);
            })
            .catch((err) => {
                console.error("Erro ao carregar o filme:", err);
            });
    }, [id]);

    useEffect(() => {

        api.get(`/movies/${id}/reviews`)
            .then((response) => {
                setReviews(response.data.reviews);
            })
            .catch((err) => {
                console.error("Erro ao carregar as avaliacoes:", err);
            });
    }, [movie]);

    return (
        <div className="movie-page">
            {/* Detalhes do filme */}
            <div className="container py-5">
                <div className="row">
                    {/* Imagem do filme */}
                    <div className="col-md-4 mb-4">
                        <div className="movie-image">
                            <img
                                src={`${process.env.REACT_APP_API}/images/movies/${movie.photo}`}
                                alt={movie.title}
                                className="img-fluid rounded"
                                onError={(e) => e.target.src = 'default-image.jpg'} // Fallback para imagem padrão
                            />
                        </div>
                    </div>

                    {/* Descrição e outras informações */}
                    <div className="col-md-8 mb-4">
                        <div className="movie-info">
                            <h3 className="info-title">{movie.title}</h3>
                            <p className="info-text">{movie.longDescription || movie.description}</p>

                            {/* Informações adicionais */}
                            <div className="movie-details">
                                <p><strong>Ano de Lançamento:</strong> {new Date(movie.releaseDate).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Gênero:</strong> {movie.genre}</p>
                            </div>
                        </div>

                        {/* Avaliações */}
                        <div className="movie-reviews mt-4">
                            <h4 className="review-title">Avaliações</h4>
                            <div>
                                {movie.reviews && movie.reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <Link to={`/reviews/${review._id}`} key={review._id}>
                                            <div className="review-card mb-4 p-4 rounded bg-dark text-white shadow-lg">
                                                <strong>{review.title}:</strong> {review.score}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p>Sem avaliações.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MoviePage;
