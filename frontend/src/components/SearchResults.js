import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from '../services/api';
import './SearchResults.css'


function SearchResults() {
    const [results, setResults] = useState([]);
    const location = useLocation(); 
    const query = new URLSearchParams(location.search).get('query'); 

    useEffect(() => {
        if (query) {
            api.get(`/movies/movie/search?name=${query}`)
                .then((response) => {
                    setResults(response.data); 
                })
                .catch((error) => {
                    console.error('Erro ao buscar filmes:', error);
                });
        }
    }, [query]);

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-white">Resultados da Busca</h2>
            {results.length > 0 ? (
                <div className="list-group">
                    {/* Exibe os filmes encontrados */}
                    {results.map((movie) => (
                        <Link to={`/movies/${movie._id}`} key={movie._id} className="list-group-item d-flex align-items-center">
                            <img
                                src={`${process.env.REACT_APP_API}/images/movies/${movie.photo}`}
                                alt={movie.title}
                                className="movie-poster me-3"
                                onError={(e) => (e.target.src = 'default-image.jpg')} 
                            />
                            <div className="movie-info">
                                <h5 className="movie-title mb-1">{movie.title}</h5>
                                <div className="movie-rating">
                                    <strong>Nota Média: </strong>
                                    <span 
                                        className={`badge ${
                                            movie.averageScore >= 7
                                                ? 'bg-success'
                                                : movie.averageScore >= 5
                                                ? 'bg-warning'
                                                : 'bg-danger'
                                        }`}
                                    >
                                        {movie.averageScore || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div>Nenhum filme encontrado</div>
            )}
        </div>
    );
}

export default SearchResults;
