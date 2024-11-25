import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import './ReviewPage.css';  // Importe a folha de estilos para a página de avaliação

function ReviewPage() {
    const { id } = useParams();
    const [review, setReview] = useState(null);  // Inicializando como null
    const [user, setUser] = useState(null);  // Inicializando como null

    // Fetch para buscar os detalhes da avaliação
    useEffect(() => {
        api.get(`/reviews/${id}`)
            .then((response) => {
                setReview(response.data.review);
            })
            .catch((err) => {
                console.error("Erro ao carregar a avaliação:", err);
            });
    }, [id]);

    // Fetch para buscar os detalhes do usuário associado à avaliação
    useEffect(() => {
        if (review && review.user) {  // Verifique se review e review.user existem
            api.get(`/user/${review.user}`)
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch((err) => {
                    console.error("Erro ao buscar o usuário:", err);
                });
        }
    }, [review]);  // Esse effect depende do `review` ser carregado

    // Verificar se as informações de review e user estão carregadas
    if (!review || !user) {
        return (
            <div className="loading">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="review-page">
            <div className="container py-5">
                <div className="row">
                    {/* Coluna para os detalhes da avaliação */}
                    <div className="col-md-8 mb-4 mx-auto">
                        <div className="review-card p-4 rounded shadow-lg bg-dark text-white">
                            <h2 className="review-title">{review.title}</h2>
                            <h6 className="review-user"></h6>
                            <p><strong>Usuário: </strong>{user.name}</p>
                            <p className="review-description">{review.review}</p>
                            <div className="review-footer">
                                <p><strong>Pontuação:</strong> {review.score}</p>
                                <p><strong>Data de Avaliação:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewPage;
