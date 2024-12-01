import { useState } from "react";
import api from "../services/api"; 
import "./MovieForm.css"; 
import { useNavigate } from 'react-router-dom';

const MovieForm = ({ showMessage }) => {
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const [preview, setPreview] = useState([]);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(""); 

    function onFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setMovie({ ...movie, photo: file }); 
        }
    }

    function handleChange(e) {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    }

    const handleGenreChange = (e) => {
        setGenres(e.target.value.split(",").map((g) => g.trim()));
        setMovie({ ...movie, genre: e.target.value.split(",").map((g) => g.trim()) });
    };

    async function submit(e) {
        e.preventDefault();
        setError(""); 

        const formData = new FormData(); 
        formData.append("title", movie.title);
        formData.append("description", movie.description);
        formData.append("releaseDate", movie.releaseDate);
        formData.append("director", movie.director);
        formData.append("genre", genres.join(","));
        if (movie.photo) {
            formData.append("photo", movie.photo); 
        }

        try {
            const token = localStorage.getItem("token"); 
            const headers = { Authorization: `Bearer ${token}` };

            const response = await api.post("/movies/add", formData, { headers });
            console.log("Filme adicionado:", response.data);
            showMessage('success', 'Filme adicionado com sucesso!');
            navigate('/')
        } catch (error) {
            console.log(movie)
            console.error("Erro ao adicionar o filme:", error);
            setError("Erro ao adicionar o filme. Tente novamente.");
            showMessage('error', 'Não foi possivel adicionar o filme.');
        }


    }

    return (
        <div className="background">
            <div className="add-movie">
                <h2>Adicionar Filme</h2>
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
                    ) : null}
                    {/* Campos do formulário */}
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
                            value={movie.releaseDate || ""}
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
                        Adicionar Filme
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MovieForm;
