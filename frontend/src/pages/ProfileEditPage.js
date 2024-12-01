import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ProfileEditPage.css';

const ProfileEditPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                
                const { data } = await api.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setName(data.name);
                setEmail(data.email);
            } catch (error) {
                toast.error('Erro ao carregar os dados do usuário.');
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem!');
            return;
        }

        try {
            const payload = {
                name,
                email,
                password: password || undefined, 
            };

            await api.patch('/edit', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success('Perfil atualizado com sucesso!');
            navigate('/profile');
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Erro ao atualizar o perfil.'
            );
        }
    };

    return (
        <div className="profile-edit-page">
            <div className="container mt-4">
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Nova Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Nova senha (opcional)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirmar Nova Senha
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            placeholder="Confirme a nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-danger mt-3" type="submit">
                        Salvar Alterações
                    </button>
                    <div className="mt-3">
                        <p>
                            Deseja voltar?{' '}
                            <button
                                className="btn btn-link p-0"
                                onClick={() => navigate('/profile')}
                            >
                                Perfil
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditPage;
