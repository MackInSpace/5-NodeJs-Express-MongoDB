const express = require('express');
const cors = require('./cors');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
        const favorites = await Favorite.findOne({ user: req.user._id }).populate('user').populate('campsites');
        res.setStatus(200).json(favorites);
    } catch (err) {
        next(err);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
        let favorite = await Favorite.findOne({ user: req.user._id });
        if (!favorite) {
            favorite = await Favorite.create({ user: req.user._id, campsites: req.body.map(campsite => campsite._id) });
        } else {
            req.body.forEach(({ _id }) => {
                if (!favorite.campsites.includes(_id)) {
                    favorite.campsites.push(_id);
                }
            });
            await favorite.save();
        }
        res.status(200).json(favorite);
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
        const favorite = await Favorite.findOneAndDelete({ user: req.user._id });
        res.status(200).json(favorite || { message: 'You do not have any favorites to delete.' });
    } catch (err) {
        next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status(403).send('PUT operation not supported on /favorites');
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
        let favorite = await Favorite.findOne({ user: req.user._id });
        if (!favorite) {
            favorite = await Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] });
        } else {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                await favorite.save();
            } else {
                return res.status(200).send({ message: 'That campsite is already in the list of favorites!' });
            }
        }
        res.status(200).json(favorite);
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
    try {
        const favorite = await Favorite.findOne({ user: req.user._id });
        if (favorite) {
            favorite.campsites = favorite.campsites.filter(id => id.toString() !== req.params.campsiteId);
            await favorite.save();
            res.status(200).json(favorite);
        } else {
            res.status(200).send('No favorites to delete.');
        } 
    } catch (err) {
        next(err);
    }
})
.get (cors.cors, authenticate.verifyUser, (req, res) => {
    res.status(403).send('GET operation not supported on /favorites/:campsiteId');
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status(403).send('PUT operation not supported on /favorites/:campsiteId');
});

module.exports = favoriteRouter;