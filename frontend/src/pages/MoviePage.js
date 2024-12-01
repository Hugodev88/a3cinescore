import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import './MoviePage.css'; // Importe a folha de estilos
import { toast } from 'react-toastify';

function MoviePage() {
    const [movie, setMovie] = useState({});
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);

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
                console.error("Erro ao carregar as avaliações:", err);
            });
    }, [movie]);

    useEffect(() => {
        if (reviews.length > 0) {
            const fetchUsers = async () => {
                try {
                    const fetchedUsers = [];

                    for (let review of reviews) {
                        const response = await api.get(`/user/${review.user}`);
                        fetchedUsers.push(response.data.user);
                    }
                    setUsers(fetchedUsers);
                } catch (error) {
                    console.error("Erro ao carregar os usuários:", error);
                    toast.error('Erro ao carregar os usuários. Tente novamente mais tarde.');
                }
            };

            fetchUsers();
        }
    }, [reviews]);

    const getBadgeColor = (score) => {
        if (score >= 8) {
          return '#4CAF50'; // Um verde mais suave (menos saturado)
        } else if (score >= 5) {
          return '#FFEB3B'; // Um amarelo mais suave (menos saturado)
        } else {
          return '#F44336'; // Um vermelho mais suave (menos saturado)
        }
      };
      

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
                            <div className="actionsMoviePage">
                                <Link to={`/review/${movie._id}`} className="btn">Avaliar</Link>
                                <Link to={`/movies/edit/${movie._id}`} className="btn">Editar</Link>
                            </div>

                        </div>

                        {/* Avaliações */}
                        <div className="movie-reviews mt-4">
                            <h4 className="review-title">Avaliações</h4>
                            <div>
                            {movie?.reviews?.length > 0 ? (
                                reviews.map((review, index) => (
                                    <Link to={`/reviews/${review._id}`} key={review._id}>
                                        <div className="review-card p-3 rounded bg-dark text-white shadow-sm">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>{review.title}</strong>
                                                {/* Calcula a cor da pontuação com base no valor */}
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: getBadgeColor(review.score),
                                                    }}
                                                >
                                                    {review.score}
                                                </span>
                                            </div>
                                            <small>Por: {users[index] ? users[index].name : 'Carregando...'}</small>
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
