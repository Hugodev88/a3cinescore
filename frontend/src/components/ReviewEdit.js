import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ReviewEdit = ({ showMessage }) => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [score, setScore] = useState(0);
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviewAndMovie = async () => {
            try {
                const response = await api.get(`/reviews/${id}`);
                const reviewData = response.data.review;
                setTitle(reviewData.title);
                setReview(reviewData.review);
                setScore(reviewData.score);

                const movieResponse = await api.get(`/movies/${reviewData.movie}`);
                setMovie(movieResponse.data.movie);
            } catch (error) {
                console.error('Erro ao buscar dados da avaliação:', error);
                showMessage('Erro ao carregar dados da avaliação.');
                toast.error('Erro ao carregar dados da avaliação');
            }
        };

        if (id) {
            fetchReviewAndMovie();
        }
    }, [id, showMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                showMessage('Você precisa estar logado!');
                return;
            }

            await api.put(
                `/reviews/edit/${id}`,
                {
                    title,
                    review,
                    score,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('Avaliação atualizada com sucesso!');

            setTitle('');
            setReview('');
            setScore(0);

            navigate(`/reviews/${id}`);
        } catch (error) {
            console.error(error);
            showMessage('Erro ao atualizar avaliação');
            toast.error('Erro ao atualizar avaliação');
        }
    };

    if (!movie) return <div>Carregando dados do filme...</div>;

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
