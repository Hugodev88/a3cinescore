// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUser(response.data);
            } catch (error) {
                toast.error('Erro ao carregar perfil');
            }
        };
        fetchUser();
    }, []);

    if (!user) return <div>Carregando perfil...</div>;

    return (
        <div className="container mt-4">
            <h2>Perfil de {user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Data de Registro: {user.createdAt}</p>
        </div>
    );
};

export default ProfilePage;
