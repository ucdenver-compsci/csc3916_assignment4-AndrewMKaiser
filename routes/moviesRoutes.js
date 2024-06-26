var express = require('express');
var router = express.Router();
var Movie = require('../models/Movies');
var mongoose = require('mongoose');

router.get('/', function (req, res) {
    Movie.find({}, function(err, movies) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(movies);
        }
    });
});


router.get('/:movieparameter', function (req, res) {
    const id = mongoose.Types.ObjectId(req.params.movieparameter);
    if (!req.query.reviews) {
        // if(!req.body.movieId || !req.body.username || !req.body.review || !req.body.rating) 
        //     res.status(404).send({success: false, msg: 'Ensure all fields are entered.'});
        Movie.findOne({ _id: id }, function(err, movie) {
            if (!movie) {
                
                res.status(404).send({success: false, msg: 'Movie not found.'});
            } else if (err) {
                res.status(500).send(err);
            } else {
                res.json(movie);
            }
        });
    } else if (req.query.reviews === 'true') {
        Movie.aggregate([
            {
                $match: { _id: id }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movieId",
                    as: "reviews"
                }
            }
        ]).exec(function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(result);
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid query parameter.' });
    }
});
            

router.post('/', function(req, res) {
    var movie = new Movie();
    movie.title = req.body.title;
    movie.releaseDate = req.body.releaseDate;
    movie.genre = req.body.genre;
    movie.actors = req.body.actors;

    movie.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ success: true, message: 'Movie saved successfully.', movie: movie });
        }
    });
});

router.put('/:movieparameter', function(req, res) {
    Movie.findOneAndUpdate({ title: req.params.movieparameter }, req.body, function(err, movie) {
        if (err) {
            res.status(500).send(err);
        } else if (!movie) {
            res.status(404).send({success: false, msg: 'Movie not found.'});
        } else {    
            res.json({ success: true, message: 'Movie updated successfully.' });
        }
    });
});

router.delete('/:movieparameter', function(req, res) {
    Movie.findOneAndDelete({ title: req.params.movieparameter }, function(err, movie) {
        if (err) {
            res.send(err);
        } else if (!movie) {
            res.status(404).json({ success: false, message: 'Movie not found.' });
        } else {
            res.json({ success: true, message: 'Movie deleted successfully.' });
        }
    });
});    

router.all('/', function(req, res) {
    res.status(405).send({success: false, msg: 'Method not allowed.'});
});

module.exports = router;