const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Review = mongoose.model(
    'Review',
    new Schema({
        user: {
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        score: {
            type: Number,
            min: 0,
            max: 10
        },
        review: {
            type: String, 
            required: true
        },
        movie: {  
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
        }
    }, { timestamps: true })
);

module.exports = Review;
