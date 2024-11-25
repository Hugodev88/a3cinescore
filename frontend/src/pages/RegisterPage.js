// src/pages/RegisterPage.js
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validação simples: as senhas devem ser iguais
        if (password !== confirmpassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        // Verificação se algum campo está vazio
        if (!name || !email || !password || !confirmpassword) {
            toast.error('Todos os campos são obrigatórios!');
            return;
        }

        try {
            // Enviando os dados para o backend
            await api.post('/register', { name, email, password, confirmpassword });
            toast.success('Registro realizado com sucesso!');
            navigate('/login'); // Redireciona após registro bem-sucedido
        } catch (error) {
            toast.error('Erro no registro.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className='text-white'>Registrar</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome de Usuário</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Nome de Usuário"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        placeholder="Confirmar Senha"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="btn btn-danger mt-3" type="submit">
                    Registrar
                </button>

                <div className="mt-3">
                <p>Já tem uma conta? <button className="btn btn-link p-0" onClick={() => navigate('/login')}>Entre aqui</button></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
