import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import api from '../services/api';
import './SearchBox.css'

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate(); // Hook para navegação

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await api.get(`movies/movie/search?name=${query}`);
            // Redireciona para a página de resultados da pesquisa com o parâmetro 'query'
            navigate(`/search?query=${query}`); // Passa o parâmetro query na URL
        } catch (error) {
            console.error('Erro na pesquisa:', error);
        }
    };

    return (
        <div>
            <form className='searchform' onSubmit={handleSearch}>
                <input 
                    className='searchinput'
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar filme..."
                />
                <button className='searchbutton' type="submit">Buscar</button>
            </form>
        </div>
    );
};

export default SearchBox;
