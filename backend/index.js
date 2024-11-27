const express = require('express');
const cors = require('cors');

const UserRoutes = require('./routes/UserRoutes');
const MovieRoutes = require('./routes/MovieRoutes');
const ReviewRoutes = require('./routes/ReviewRoutes');

const app = express();

// Permite JSON com limite de 10MB
app.use(express.json({ limit: '10mb' }));  // Aumenta o limite para 10 MB

// Configuração de CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'  // URL de origem permitida
}));

app.use(express.static('public'));

// Definindo as rotas
app.use('/', UserRoutes);
app.use('/movies', MovieRoutes);
app.use('/reviews', ReviewRoutes);

app.listen(5000);

module.exports = app;
