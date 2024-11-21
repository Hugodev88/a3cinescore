// src/pages/RegisterPage.js
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log("TESTE")

        // Validação simples: as senhas devem ser iguais
        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        // Verificação se algum campo está vazio
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Todos os campos são obrigatórios!');
            return;
        }

        try {
            // Enviando os dados para o backend
            await api.post('/register', { name, email, password, confirmPassword });
            toast.success('Registro realizado com sucesso!');
        } catch (error) {
            toast.error('Erro no registro.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Registrar</h2>
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="btn btn-danger mt-3" type="submit">
                    Registrar
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
