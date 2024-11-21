import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css'

const Header = () => {
    const { isAuthenticated, logout } = useContext(AuthContext); // Pegando o estado do contexto
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Atualiza o estado de autenticação no contexto
        localStorage.removeItem('token'); // Limpa o token do localStorage
        navigate('/'); // Redireciona para a página inicial
    };

    return (
        <header className="bg-dark text-white p-3">
            <div className="container d-flex justify-content-between align-items-center">
                <a href="/"><h1>CineScore</h1></a>
                <nav>
                    <Link className="text-white me-3" to="/">Home</Link>
                    {!isAuthenticated ? (
                        <Link className="text-white me-3" to="/login">Login</Link>
                    ) : (
                        <>
                            <Link className="text-white me-3" to="/movies/add">Adicionar Filme</Link>
                            <Link className="text-white me-3" to="/profile">Perfil</Link>
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
