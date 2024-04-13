var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MovieSchema = require('./Movies');

const reviewSchema = new Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    username: String,
    review: String,
    rating: { type: Number, min: 0, max: 5 }
});

const Movie = mongoose.model('Movie', MovieSchema);

reviewSchema.pre('save', function(next) {
    const review = this;

    if (!review.movieId || !review.username || !review.review || !review.rating) {
        return next(new Error('All fields are required'));
    }

    next();
});

module.exports = mongoose.model('Review', reviewSchema);