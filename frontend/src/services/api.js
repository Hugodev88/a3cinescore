import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Erro na resposta da API:', error.response.data);
        } else if (error.request) {
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
