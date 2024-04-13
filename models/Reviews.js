var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
    genre: {
      type: String,
      enum: [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
      ],
    },
    actors: [{
      actorName: String,
      characterName: String,
    }],
});

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