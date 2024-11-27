import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import './ReviewPage.css';  

function ReviewPage() {
    const { id } = useParams();
    const [review, setReview] = useState(null);  
    const [user, setUser] = useState(null);  
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        const comment = {
            userName: user.name, 
            text: newComment,
            createdAt: new Date(),
        };

        setComments([...comments, comment]);
        setNewComment('');
    };

    useEffect(() => {
        api.get(`/reviews/${id}`)
            .then((response) => {
                setReview(response.data.review);
            })
            .catch((err) => {
                console.error("Erro ao carregar a avaliação:", err);
            });
    }, [id]);

    useEffect(() => {
        if (review && review.user) { 
            api.get(`/user/${review.user}`)
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch((err) => {
                    console.error("Erro ao buscar o usuário:", err);
                });
        }
    }, [review]);  

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
                    <div className="col-md-8 mb-4 mx-auto">
                        <div className="review-card p-4 rounded shadow-lg bg-dark text-white">
                            <h2 className="review-title">{review.title}</h2>
                            <p><strong>Usuário: </strong>{user.name}</p>
                            <p className="review-description"><strong>Avaliação: </strong>{review.review}</p>
                            <div className="review-footer">
                                <p><strong>Pontuação:</strong> {review.score}</p>
                                <p><strong>Data da Avaliação:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="comments-section mt-5">
                    <h3>Comentários</h3>
                    <div className="comments-list">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="comment-card p-3 rounded bg-dark text-white mb-3">
                                    <p className="comment-user mb-1"><strong>{comment.userName}</strong></p>
                                    <p className="comment-text mb-1">{comment.text}</p>
                                    <p className="comment-date text-muted">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum comentário ainda.</p>
                        )}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className="form-control mb-3"
                            rows="3"
                            required
                        />
                        <button type="submit" className="commentbtn btn btn-primary">Enviar Comentário</button>
                    </form>
                </div>
            </div>
        </div>
    );
    
}

export default ReviewPage;
