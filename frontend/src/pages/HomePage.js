import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import api from '../services/api';

const HomePage = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        api.get('/movies')
            .then((response) => setMovies(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="container">
            <h1 className="text-white mt-4">Filmes em Destaque</h1>
            <MovieList movies={movies} />
        </div>
    );
};

export default HomePage;
