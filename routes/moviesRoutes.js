var express = require('express');
var router = express.Router();
var Movie = require('../models/Movies');

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
    Movie.findOne({ title: req.params.movieparameter }, function(err, movie) {
        if (err) {
            res.status(500).send(err); // internal server error
        } else if (!movie) {
            res.status(404).send({success: false, msg: 'Movie not found.'});
        } else {
            res.json(movie);
        }
    });
            
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