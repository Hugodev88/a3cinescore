import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';
import './SearchBox.css'

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate(); 

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await api.get(`movies/movie/search?name=${query}`);
            
            navigate(`/search?query=${query}`); 
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
