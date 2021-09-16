const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const { set } = require('mongoose');
const dishRouter = express.Router();
const dishRouterId = express.Router();



// Concept of chaning 
dishRouter.use(bodyParser.json());
dishRouterId.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {

        Dishes.find({}).then((dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dishes);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .post((req, res, next) => {
        Dishes.create(req.body).then((dish) => {
            console.log("Dish Created ", dish)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on dishes ");
    })


    .delete((req, res, next) => {

        Dishes.remove({}).then((response) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    });


dishRouter.route('/:dishId')


    .get((req, res, next) => {
        Dishes.findById(req.params.dishId).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on dishes/ " + req.params.dishId);
    })

    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, {
            new: true
        }).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })


    .delete((req, res, next) => {

        Dishes.findByIdAndRemove(req.params.dishId).then((response) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    });


dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {

        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }
            else {
                err = new Error('Dish' + req.params.dishId + 'Dish not Found');
                err.status = 404;
                return next(err);
            }
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .post((req, res, next) => {
        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null) {

                res.comments.push(req.body);
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);

                    }, (err) => { next(err) })

            }
            else {
                err = new Error('Dish' + req.params.dishId + 'Dish not Found');
                err.status = 404;
                return next(err);
            }
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on dishes " + req.params.dishId + ' /comments');
    })


    .delete((req, res, next) => {

        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null) {

                for (let index = (dishes.comments.length - 1); index >= 0; index--) {

                    dish.comments.id(dish.comments[index]._id).remove();
                }

                res.comments.push(req.body);
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);

                    }, (err) => { next(err) })

            }
            else {
                err = new Error('Dish' + req.params.dishId + 'Dish not Found');
                err.status = 404;
                return next(err);
            }
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    });


dishRouter.route('/:dishId/comments/:commentsId')


    .get((req, res, next) => {
        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentId));
            }
            else if (dish == null) {
                err = new Error('Dish' + req.params.dishId + 'Dish not Found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comments ' + req.params.commentId + 'Comment not Found');
                err.status = 404;
                return next(err);

            }
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })

    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on dishes/ " + req.params.dishId + '/comments' + req.params.commentId);
    })

    .put((req, res, next) => {
        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                res.comments.push(req.body);
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentId).rating = req.body.comment;
                }
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);

                    }, (err) => { next(err) })
            }
            else if (dish == null) {
                err = new Error('Dish' + req.params.dishId + 'Dish not Found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comments ' + req.params.commentId + 'Comment not Found');
                err.status = 404;
                return next(err);

            }
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    })


    .delete((req, res, next) => {

        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId != null)) {

                dish.comments.id(req.params.commentId).remove();
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);

                    }, (err) => { next(err) })

            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + 'Dish not Found');
                err.status = 404;
                return next(err);
            }

            else {
                err = new Error('comment ' + req.params.commentId + 'Commment not Found');
                err.status = 404;
                return next(err);
            }
        }, (err) => { next(err) }
        ).catch((err) => {
            next(err);
        })
    });




module.exports = dishRouter;
