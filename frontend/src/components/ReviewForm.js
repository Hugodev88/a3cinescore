import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ReviewForm = ({ showMessage }) => {
    const { id } = useParams(); // Aqui usamos 'id' que é o nome do parâmetro da rota
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [score, setScore] = useState(0);
    const [movie, setMovie] = useState(null); // Inicialmente null

    // Função para buscar os detalhes do filme
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                console.log(id); // Verifica se o 'id' está sendo capturado corretamente
                const response = await api.get(`/movies/${id}`);
                setMovie(response.data.movie);
            } catch (error) {
                console.error('Erro ao buscar dados do filme:', error);
            }
        };

        if (id) { // Certifique-se de que o 'id' está presente antes de fazer a requisição
            fetchMovie();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/reviews/add`, {
                title,
                review,
                score,
                movieId: id, // Envia o 'id' do filme no corpo da requisição
            });
            showMessage('Avaliação enviada com sucesso!'); // Usando a função passada como props
            setTitle('');
            setReview('');
            setScore(0);
        } catch (error) {
            console.error(error);
            showMessage('Erro ao enviar avaliação');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-light rounded">
            <h3 className="mb-4 text-dark">
                Avaliar o Filme: {movie ? movie.title : 'Carregando...'}
            </h3>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Título da Avaliação"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    placeholder="Escreva sua avaliação"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="4"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    className="form-control"
                    placeholder="Nota (0-10)"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    min="0"
                    max="10"
                    required
                />
            </div>
            <button className="btn btn-danger" type="submit">Enviar Avaliação</button>
        </form>
    );
};

export default ReviewForm;
