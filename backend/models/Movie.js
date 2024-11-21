const mongoose = require('../db/conn');
const { Schema } = mongoose;
const { calculateAverageScore } = require('./hooks/movieHooks'); // Importa o hook de média

const MovieSchema = new Schema({
    title: {
        type: String,
        required: [true, "O título é obrigatório"],
        minlength: [2, "O título deve ter pelo menos 2 caracteres"],
        maxlength: [100, "O título pode ter no máximo 100 caracteres"]
    },
    description: {
        type: String,
        required: [true, "A descrição é obrigatória"],
        minlength: [10, "A descrição deve ter pelo menos 10 caracteres"],
        maxlength: [1000, "A descrição pode ter no máximo 1000 caracteres"]
    },
    releaseDate: {
        type: Date,
        required: [true, "A data de lançamento é obrigatória"]
    },
    director: {
        type: String,
        required: [true, "O diretor é obrigatório"],
        minlength: [2, "O nome do diretor deve ter pelo menos 2 caracteres"],
        maxlength: [50, "O nome do diretor pode ter no máximo 50 caracteres"]
    },
    genre: {
        type: [String],
        required: [true, "Pelo menos um gênero é obrigatório"],
        validate: {
            validator: (genres) => genres.length > 0,
            message: "O filme deve ter pelo menos um gênero"
        }
    },
    photo: {
        type: String,
        default: "default.jpg" // foto padrão caso nenhuma seja fornecida
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    averageScore: {
        type: Number,
        default: 0 // média inicial das avaliações
    }
}, { timestamps: true });

// Aplica o hook de cálculo de média antes de salvar
MovieSchema.pre('save', async function (next) {
    await calculateAverageScore(this); // Chama o hook separado
    next();
});

module.exports = mongoose.model('Movie', MovieSchema);
