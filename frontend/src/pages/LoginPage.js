import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import './LoginPage.css'

const LoginPage = ({ showMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            login(response.data.token);
            showMessage('success', 'Login realizado com sucesso!');
            navigate('/');
        } catch (error) {
            showMessage('error', 'Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="login-page">
            <div className="container mt-5">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn btn-danger mt-3" type="submit">Entrar</button>
                </form>

                {/* Link para a página de registro */}
                <div className="mt-3">
                    <p>Não tem uma conta? <button className="btn btn-link p-0" onClick={() => navigate('/register')}>Cadastre-se aqui</button></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
