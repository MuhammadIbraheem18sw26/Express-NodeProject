const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const { set } = require('mongoose');
const leaderRouter = express.Router();




// Concept of chaning 
leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
    .get((req, res, next) => {

        Leaders.find({}).then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .post((req, res, next) => {
        Leaders.create(req.body).then((leader) => {
            console.log("leader Created ", leader)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on Leaders ");
    })


    .delete((req, res, next) => {

        Leaders.remove({}).then((response) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    });


leaderRouter.route('/:leaderId')


    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId).then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on leaders/ " + req.params.leaderId);
    })

    .put((req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, {
            new: true
        }).then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })


    .delete((req, res, next) => {

        Leaders.findByIdAndRemove(req.params.leaderId).then((response) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    });






module.exports = leaderRouter;
