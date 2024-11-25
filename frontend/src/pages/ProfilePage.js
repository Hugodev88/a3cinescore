import React, { useEffect, useState } from 'react';
import api from '../services/api';  // Supondo que você tenha configurado o Axios em `api.js`
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import './ProfilePage.css'

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);  // Novo estado para armazenar as avaliações
    const [movies, setMovies] = useState([]);  // Novo estado para armazenar os filmes
    const navigate = useNavigate();

    useEffect(() => {
        // Função para buscar as informações do usuário
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    toast.error('Você precisa estar logado.');
                    navigate('/login');
                    return;
                }

                const response = await api.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);  // Atualiza o estado com os dados do usuário
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                toast.error('Erro ao carregar perfil. Por favor, tente novamente.');
                navigate('/login');
            }
        };

        fetchUser();  // Chama a função para buscar o usuário
    }, [navigate]);  // Executa quando o componente é montado ou o 'navigate' é alterado

    // Função para buscar as avaliações do usuário
    useEffect(() => {
        if (user) {
            const fetchReviews = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await api.get(`/user/${user._id}/reviews`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setReviews(response.data.reviews);  // Atualiza as avaliações
                } catch (error) {
                    console.error('Erro ao carregar avaliações:', error);
                    toast.error('Erro ao carregar avaliações. Tente novamente mais tarde.');
                }
            };

            fetchReviews();  // Chama a função para buscar as avaliações quando o usuário for carregado
        }
    }, [user]);  // Executa quando o estado do 'user' for atualizado

    // Função para buscar os filmes das avaliações
    useEffect(() => {
        if (reviews.length > 0) {
            const fetchMovies = async () => {
                try {
                    const fetchedMovies = [];
                    
                    for (let review of reviews) {
                        const response = await api.get(`/movies/${review.movie}`);
                        fetchedMovies.push(response.data.movie); 
                    }
                    setMovies(fetchedMovies); 
                } catch (error) {
                    console.error('Erro ao carregar os filmes:', error);
                    toast.error('Erro ao carregar os filmes. Tente novamente mais tarde.');
                }
            };

            fetchMovies();  
        }
    }, [reviews]);  

    if (!user) return <div className="text-center mt-5">Carregando perfil...</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header text-center">
                            <h3>Perfil de {user.name}</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-8">
                                    <h5 className="card-title">Informações do Usuário</h5>
                                    <p className="card-text">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p className="card-text">
                                        <strong>Quantidade de Avaliações:</strong> {user.reviewCount || 0}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-warning btn-sm" onClick={() => navigate('/edit-profile')}>
                                            Editar Perfil
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Exibindo as Avaliações */}
                            <div className="mt-4">
                                <h5>Avaliações:</h5>
                                {reviews.length === 0 ? (
                                    <p>Nenhuma avaliação encontrada.</p>
                                ) : (
                                    <ul className="list-group">
                                        {reviews.map((review, index) => {
                                            // Encontra o filme correspondente
                                            const movie = movies.find((m) => m._id === review.movie);

                                            return (
                                                <li key={index} className="">
                                                    <div key={index} className="review-card p-3 mb-3">
                                                        {/* Título e Ações */}
                                                        <div className="d-flex justify-content-between">
                                                            <strong>Avaliação {index + 1}</strong>
                                                            <div>
                                                                {/* Botões de Editar e Excluir */}
                                                                <button className="btn btn-warning btn-sm me-2">
                                                                    Editar
                                                                </button>
                                                                <button className="btn btn-danger btn-sm">
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Informações sobre o filme */}
                                                        <div className="review-details">
                                                            <p><strong>Filme:</strong> {movie ? movie.title : 'Carregando...'}</p>
                                                            <p><strong>Nota:</strong> {review.score}</p>
                                                            <p><strong>Data:</strong><small>{new Date(review.createdAt).toLocaleDateString()}</small></p>
                                                        </div>

                                                        {/* Botão de Ver Mais Detalhes */}
                                                        <div className="mt-2">
                                                            <Link className="btn btn-info btn-sm" to={`/reviews/${review._id}`}>
                                                                Ver Mais Detalhes
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
