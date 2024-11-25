import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import Header from './components/Header';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';
import MovieForm from './components/MovieForm';
import ReviewForm from './components/ReviewForm';
import ReviewPage from './pages/ReviewPage';
import SearchResults from './components/SearchResults';

// Importando o AuthContext
import { AuthContext } from './contexts/AuthContext';


const App = () => {
    const { isAuthenticated, login, logout } = useContext(AuthContext);

    // Função para mostrar mensagens flash
    const showMessage = (type, message) => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast.info(message);
    };

    useEffect(() => {
        // Se o token estiver no localStorage, atualize o estado de autenticação
        const token = localStorage.getItem('token');
        if (token) {
            login(token);
        }
    }, [login]); // O `login` vai ser chamado sempre que o componente for montado ou re-renderizado

    return (
        <Router>
            <div className="App bg-dark text-white">
                <Header />

                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movies/:id" element={<MoviePage />} />
                        <Route path="/movies/add" element={<MovieForm showMessage={showMessage} />} />
                        <Route path="/review/:id" element={<ReviewForm showMessage={showMessage} />} />
                        <Route path="/reviews/:id" element={<ReviewPage />} />
                        <Route path="/search" element={<SearchResults />} />
                        {/* /movies/add */}
                        <Route path="/login" element={<LoginPage showMessage={showMessage} />} />
                        <Route path="/register" element={<RegisterPage showMessage={showMessage} />} />
                        <Route
                            path="/profile"
                            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
                        />
                        
                    </Routes>
                </div>
                <Footer />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </div>
        </Router>
    );
};

export default App;
