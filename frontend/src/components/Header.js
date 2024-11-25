import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css'
import SearchBox from './SearchBox';

const Header = () => {
    const { isAuthenticated, logout } = useContext(AuthContext); // Pegando o estado do contexto
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        localStorage.removeItem('token'); // 
        navigate('/'); 
    };

    return (
        <header>
            <div className="container d-flex justify-content-between align-items-center">
                <Link className='link title' to="/">CineScore</Link>
                <nav className='navbar'>
                    {!isAuthenticated ? (
                        <Link className="link" to="/login">Login</Link>
                    ) : (
                        <>
                            <SearchBox />
                            <Link className="link add" to="/movies/add">Adicionar Filme</Link>
                            <Link className="link perfil" to="/profile">Perfil</Link>
                            <button
                                className="btn btn-danger text-white"
                                onClick={handleLogout}
                            >
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
