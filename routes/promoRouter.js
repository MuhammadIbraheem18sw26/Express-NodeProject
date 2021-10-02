const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const { set } = require('mongoose');
const promoRouter = express.Router();
const authenticate = require('../authenticate')
const cors = require('./cors');




// Concept of chaning 
promoRouter.use(bodyParser.json());


promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {

        Promotions.find({}).then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Promotions.create(req.body).then((promo) => {
            console.log("promo Created ", promo)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on Promotions ");
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Leaders.remove({}).then((response) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    });


promoRouter.route('/:promoId')


    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promotions.findById(req.params.promoId).then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on promos/ " + req.params.promoId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {
            new: true
        }).then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Promotions.findByIdAndRemove(req.params.promoId).then((response) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    });

module.exports = promoRouter;
