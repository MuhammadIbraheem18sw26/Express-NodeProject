const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const { set } = require('mongoose');
const promoRouter = express.Router();
const authenticate = require('../authenticate')




// Concept of chaning 
promoRouter.use(bodyParser.json());


promoRouter.route('/')
    .get((req, res, next) => {

        Promotions.find({}).then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .post(authenticate.verifyUser, (req, res, next) => {
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

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on Promotions ");
    })


    .delete(authenticate.verifyUser, (req, res, next) => {

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


    .get((req, res, next) => {
        Promotions.findById(req.params.promoId).then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    })

    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on promos/ " + req.params.promoId);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
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


    .delete(authenticate.verifyUser, (req, res, next) => {

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
