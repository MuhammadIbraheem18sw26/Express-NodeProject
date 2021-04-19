const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
const dishRouterId = express.Router();



// Concept of chaning 
dishRouter.use(bodyParser.json());
dishRouterId.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain")
        next();

    })

    .get((req, res, next) => {
        res.end("Will send all the dishes to you!");
    })

    .post((req, res, next) => {
        res.end("Will add this dish ! " + req.body.name + " and with the details " + req.body.description);
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on dishes ");
    })


    .delete((req, res, next) => {

        res.end("deleting all Dishes  ");
    });


dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain")
        next();

    })

    .get((req, res, next) => {
        res.end("Will send details of dish! " + req.params.dishId + " to you");
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on dishes/ " + req.params.dishId);
    })

    .put((req, res, next) => {
        res.write("updating the dish " + req.params.dishId + "\n")
        res.end("will update the dish:  " + req.body.name + " with details " + req.body.description);
    })


    .delete((req, res, next) => {

        res.end("deleting  Dishes : " + req.body.dishId);
    });




module.exports = dishRouter;
