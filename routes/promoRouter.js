const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();





promoRouter.use(bodyParser.json());


// Concept of chaning 

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain")
        next();

    })

    .get((req, res, next) => {
        res.end("Will send all the promotions to you!");
    })

    .post((req, res, next) => {
        res.end("Will add this  promotions ! " + req.body.namepro + " and with the details " + req.body.descriptionpro);
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on   promotions ");
    })


    .delete((req, res, next) => {

        res.end("deleting all   promotions  ");
    });

promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain")
        next();

    })

    .get((req, res, next) => {
        res.end("Will send details of promo! " + req.params.promoId + " to you");
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on  promotion " + req.params.promoId);
    })

    .put((req, res, next) => {
        res.write("updating the promo " + req.params.promoId + "\n")
        res.end("will update the promo:  " + req.body.name + " with details " + req.body.description);
    })


    .delete((req, res, next) => {

        res.end("deleting   promo : " + req.body.promoId);
    });




module.exports = promoRouter;