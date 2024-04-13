var express = require('express');
var router = express.Router();
var Review = require('../models/Reviews');
var crypto = require("crypto");
var rp = require('request-promise');

const GA_TRACKING_ID = process.env.GA_KEY;

function trackDimension(category, action, label, value, dimension, metric) {
    var options = {
        method: 'GET',
        url: 'https://www.google-analytics.com/collect',
        qs: {
            v: '1',
            tid: GA_TRACKING_ID,
            cid: crypto.randomBytes(16).toString("hex"),
            t: 'event',
            ec: category,
            ea: action,
            el: label,
            ev: value,
            cd1: dimension,
            cm1: metric
        },
        headers: { 'Cache-Control': 'no-cache' }
    };

    return rp(options);
}

router.get('/', function (req, res) {
    if (req.query.reviews === 'true') {
        Review.aggregate([
            {
                $lookup: {
                    from: "movies", // name of the foreign collection
                    localField: "movieId", // field in the reviews collection
                    foreignField: "_id", // field in the movies collection
                    as: "movieDetails" // output array where the joined movie details will be placed
                }
            }
        ]).exec(function(err, reviews) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(reviews);
            }
        });
    } else {
        Review.find({}, function(err, reviews) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(reviews);
            }
        });
    }
});

router.post('/', function(req, res) {
    var review = new Review();
    review.movieId = req.body.movieId;
    review.username = req.body.username;
    review.review = req.body.review;
    review.rating = req.body.rating;

    review.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ success: true, message: 'Review created!' });
        }
    });
});

module.exports = router;