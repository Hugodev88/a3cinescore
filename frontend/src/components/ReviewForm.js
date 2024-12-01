import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './ReviewForm.css';

const ReviewForm = ({ showMessage }) => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [score, setScore] = useState(0);
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await api.get(`/movies/${id}`);
                setMovie(response.data.movie);
            } catch (error) {
                console.error('Erro ao buscar dados do filme:', error);
            }
        };

        if (id) {
            fetchMovie();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showMessage('Você precisa estar logado!');
                return;
            }

            await api.post(
                `/reviews/add`,
                {
                    title,
                    score,
                    review,
                    movieId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            toast.success('Avaliação enviada com sucesso!');
            setTitle('');
            setReview('');
            setScore(0);
            navigate('/');
        } catch (error) {
            console.error(error);
            showMessage('Erro ao enviar avaliação');
            toast.error('Erro ao enviar avaliação');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form p-4">
            <h3 className="review-title mb-4">
                Avaliar o Filme: {movie ? movie.title : 'Carregando...'}
            </h3>
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
            <button className="review-submit-btn" type="submit">Enviar Avaliação</button>
        </form>
    );
};

export default ReviewForm;
