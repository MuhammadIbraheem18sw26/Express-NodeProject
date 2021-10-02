const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const { set } = require('mongoose');
var authenticate = require('../authenticate');
const dishRouter = express.Router();
const dishRouterId = express.Router();
const cors = require('./cors');



// Concept of chaning 
dishRouter.use(bodyParser.json());
dishRouterId.use(bodyParser.json());

// view by any one 
dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {

        Dishes.find({})
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => { next(err) }
            ).catch((err) => {
                next(err);
            })
    })
    // only admin can POST Dishes 
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    // only admin can PUT Dishes 
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on dishes ");
    })

    // only admin can DElete Dishes 
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

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

    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author').then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => { next(err) }
            ).catch((err) => {
                next(err);
            })

    })
    // only admin can POST Dishes
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on dishes/ " + req.params.dishId);
    })
    // only admin can PUT Dishes
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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

    // only admin can DElete Dishes
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

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
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {

        Dishes.findById(req.params.dishId).populate('comments.author').then((dish) => {
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

    // only user it self  can post comment
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null) {
                req.body.author = req.user._id;
                dish.comments.push(req.body);
                dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id).
                            populate('comments.author').
                            then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            })


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
    // only user it self  can PUT comment
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on dishes " + req.params.dishId + ' /comments');
    })

    // both user & admin can delete comments 
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

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


    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId).populate('comments.author')
            .then((dish) => {
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
    // this operation is not supported 
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on dishes/ " + req.params.dishId + '/comments' + req.params.commentId);
    })

    // only user can perforn this operation 
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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
                        Dishes.findById(dish._id).
                            populate('comments.author').
                            then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            })

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

    // only user can perforn this operation 
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Dishes.findById(req.params.dishId).then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId != null)) {

                dish.comments.id(req.params.commentId).remove();
                dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id).
                            populate('comments.author').
                            then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            });

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
