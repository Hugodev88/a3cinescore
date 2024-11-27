import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify'; // Importando o toast para mostrar a mensagem
import './ReviewForm.css';  // Importe a folha de estilos para o formulário de avaliação

const ReviewForm = ({ showMessage }) => {
    const { id } = useParams(); // Aqui usamos 'id' que é o nome do parâmetro da rota
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [score, setScore] = useState(0);
    const [movie, setMovie] = useState(null); // Inicialmente null
    const navigate = useNavigate(); // Usando o hook useNavigate para redirecionar

    // Função para buscar os detalhes do filme
    useEffect(() => {
        const fetchMovie = async () => {
            try {
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
            const token = localStorage.getItem('token');  // Recupera o token do localStorage
    
            // Verifica se o token existe antes de enviar a requisição
            if (!token) {
                showMessage('Você precisa estar logado!');
                return;
            }
    
            // Adiciona o token no cabeçalho da requisição

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
                        Authorization: `Bearer ${token}`,  // Inclui o token no cabeçalho
                    }
                }
            );
    
            // Exibe o toast de sucesso
            toast.success('Avaliação enviada com sucesso!');
    
            // Limpa os campos do formulário
            setTitle('');
            setReview('');
            setScore(0);
    
            // Redireciona para a página inicial após o envio

            console.log(review)

            navigate('/'); // Redireciona para a página inicial
        } catch (error) {
            console.error(error);
            showMessage('Erro ao enviar avaliação');  // Mensagem de erro
            toast.error('Erro ao enviar avaliação');  // Exibe um toast de erro
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
