import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // Instância do Axios configurada
import "./MovieForm.css";

const MovieEdit = ({ showMessage }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const [preview, setPreview] = useState(null);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(""); // Para gerenciar erros de envio

    // Carregar dados do filme
    useEffect(() => {
        const loadMovie = async () => {
            try {
                const response = await api.get(`/movies/${id}`);
                const movieData = response.data.movie;
                setMovie(movieData);
                setGenres(movieData.genre); // Preenche os gêneros
                setPreview(movieData.photo ? `${process.env.REACT_APP_API}/images/movies/${movieData.photo}` : null);
            } catch (error) {
                console.error("Erro ao carregar filme:", error);
            }
        };

        loadMovie();
    }, [id]);

    // Atualiza o preview da imagem
    function onFileChange(e) {
        const file = e.target.files[0];
    
        // Verifica se o arquivo excede 10MB
        if (file && file.size > 10 * 1024 * 1024) {
            alert("O arquivo é muito grande. O limite é 10MB.");
            return;
        }
    
        if (file) {
            setPreview(URL.createObjectURL(file));
            setMovie({ ...movie, photo: file }); // Adiciona a foto ao state
        }
    }
    

    // Atualiza os campos do formulário
    function handleChange(e) {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    }

    // Atualiza os gêneros ao separá-los por vírgula
    const handleGenreChange = (e) => {
        setGenres(e.target.value.split(",").map((g) => g.trim()));
        setMovie({ ...movie, genre: e.target.value.split(",").map((g) => g.trim()) });
    };

    // Envia o formulário
    async function submit(e) {
        e.preventDefault();
        setError(""); 

        const data = {
            title: movie.title,
            description: movie.description,
            releaseDate: movie.releaseDate,
            director: movie.director,
            genre: genres.join(","),
            photo: movie.photo 
        };

        try {
            const token = localStorage.getItem("token"); 
            const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

            const response = await api.post(`/movies/edit/${id}`, data, { headers });
            console.log("Filme atualizado:", response.data);
            showMessage('success', 'Filme atualizado com sucesso!');
            navigate('/');
        } catch (error) {
            console.error("Erro ao editar o filme:", error);
            setError("Erro ao editar o filme. Tente novamente.");
            showMessage('error', 'Não foi possível editar o filme.');
        }
    }

    function formatDateForInput(dateString) {
        if (!dateString) return ""; // Se não houver data, retorna uma string vazia
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses começam do 0
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Retorna no formato "yyyy-MM-dd"
    }
    

    return (
        <div className="background">
            <div className="add-movie">
                <h2>Editar Filme</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={submit} className="movie-form">

                    {preview ? (
                        <div>
                            <img
                                src={preview}
                                alt="Preview"
                                className="preview-image"
                            />
                        </div>
                    ) : (
                        <img
                            src={`${process.env.REACT_APP_API}/images/movies/${movie.photo}`}
                            alt={movie.title}
                            className="preview-image"
                            onError={(e) => (e.target.src = 'default-image.jpg')}
                        />
                    )}

                    <div className="form-group">
                        <label>Foto: (JPG OU PNG)</label>
                        <input type="file" name="photo" onChange={onFileChange} />
                    </div>

                    <div className="form-group">
                        <label>Título:</label>
                        <input
                            type="text"
                            name="title"
                            value={movie.title || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição:</label>
                        <textarea
                            name="description"
                            value={movie.description || ""}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Data de Lançamento:</label>
                        <input
                            type="date"
                            name="releaseDate"
                            value={formatDateForInput(movie.releaseDate)}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">
                        <label>Diretor:</label>
                        <input
                            type="text"
                            name="director"
                            value={movie.director || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gêneros (separados por vírgula):</label>
                        <input
                            type="text"
                            value={genres.join(", ") || ""}
                            onChange={handleGenreChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Atualizar Filme
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MovieEdit;
