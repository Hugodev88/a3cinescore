import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ReviewEdit = ({ showMessage }) => {
    const { id } = useParams(); // Parâmetro 'id' para identificar a avaliação
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [score, setScore] = useState(0);
    const [movie, setMovie] = useState(null); // Inicialmente null
    const navigate = useNavigate(); // Usando o hook useNavigate para redirecionar

    // Função para buscar os detalhes da avaliação e do filme
    useEffect(() => {
        const fetchReviewAndMovie = async () => {
            try {
                const response = await api.get(`/reviews/${id}`);
                const reviewData = response.data.review;
                setTitle(reviewData.title);
                setReview(reviewData.review);
                setScore(reviewData.score);

                // Buscar os dados do filme associado à avaliação
                const movieResponse = await api.get(`/movies/${reviewData.movie}`);
                setMovie(movieResponse.data.movie);
            } catch (error) {
                console.error('Erro ao buscar dados da avaliação:', error);
                showMessage('Erro ao carregar dados da avaliação.');
                toast.error('Erro ao carregar dados da avaliação');
            }
        };

        if (id) {
            fetchReviewAndMovie(); // Busca os dados se o ID da avaliação estiver presente
        }
    }, [id, showMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');  // Recupera o token do localStorage

            // Verifica se o token existe antes de enviar a requisição
            if (!token) {
                showMessage('Você precisa estar logado!');
                return;
            }

            // Atualiza a avaliação
            await api.put(
                `/reviews/edit/${id}`, // Rota para atualizar a avaliação
                {
                    title,
                    review,
                    score,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Inclui o token no cabeçalho
                    },
                }
            );

            // Exibe o toast de sucesso
            toast.success('Avaliação atualizada com sucesso!');

            // Limpa os campos do formulário
            setTitle('');
            setReview('');
            setScore(0);

            // Redireciona para a página inicial após a edição
            navigate(`/reviews/${id}`); // Redireciona para a página da avaliação ou outra página
        } catch (error) {
            console.error(error);
            showMessage('Erro ao atualizar avaliação');
            toast.error('Erro ao atualizar avaliação');
        }
    };

    if (!movie) return <div>Carregando dados do filme...</div>; // Enquanto o filme não é carregado

    return (
        <form onSubmit={handleSubmit} className="review-form p-4">
            <h3 className="review-title mb-4">Editar Avaliação do Filme: {movie.title}</h3>
            <div className="mb-3">
                <input
                    type="text"
                    className="review-input"
                    placeholder="Título da Avaliação"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <textarea
                    className="review-textarea"
                    placeholder="Escreva sua avaliação"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="4"
                    required
                />
            </div>
            <div className="mb-3">
                <h3 className="mb-2 fs-6">Nota de 0 a 10</h3>
                <input
                    type="number"
                    className="review-input"
                    placeholder="Nota (0-10)"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    min="0"
                    max="10"
                    required
                />
            </div>
            <button className="review-submit-btn" type="submit">Atualizar Avaliação</button>
        </form>
    );
};

export default ReviewEdit;
