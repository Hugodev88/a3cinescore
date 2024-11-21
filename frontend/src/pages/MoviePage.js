import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './MoviePage.css'; // Importe a folha de estilos

function MoviePage() {
    const [movie, setMovie] = useState({});
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState([]);

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
                console.error("Erro ao carregar o filme:", err);
            });
    }, [id]);

    console.log(user)

    return (
        <div className="movie-page">
            {/* Imagem de capa do filme */}
            <div
                className="movie-header"
                style={{
                    backgroundImage: `url(${movie.photo || 'default-image.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '400px', // Ajuste conforme necessário
                }}
            >
                <div className="container text-white py-5">
                    <h2 className="movie-title">{movie.title}</h2>
                    <p className="movie-description">{movie.description}</p>
                </div>
            </div>

            {/* Detalhes do filme */}
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <h3>Avaliações:</h3>
                        {movie.reviews && movie.reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="review-card mb-4 p-4 rounded bg-dark text-white">
                                    <strong>{review.title}:</strong> {user.name}
                                </div>
                            ))
                        ) : (
                            <p>Sem avaliações.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoviePage;
