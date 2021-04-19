const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();


leaderRouter.use(bodyParser.json());


// Concept of chaning
leaderRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain")
    next();

})

    .get((req, res, next) => {
        res.end("Will send all the leader to you!");
    })

    .post((req, res, next) => {
        res.end("Will add this  leader ! " + req.body.nameleader + " and with the details " + req.body.descriptionleader);
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("Put operation is not supported on   leader ");
    })


    .delete((req, res, next) => {

        res.end("deleting all   leader  ");
    });



leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain")
        next();

    })

    .get((req, res, next) => {
        res.end("Will send details of leader! " + req.params.leaderId + " to you");
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation is not supported on  leader/ " + req.params.leaderId);
    })

    .put((req, res, next) => {
        res.write("updating the leader " + req.params.leaderId + "\n")
        res.end("will update the leader:  " + req.body.nameleader + " with details " + req.body.descriptionleader);
    })


    .delete((req, res, next) => {

        res.end("deleting   leader : " + req.body.leaderId);
    });

module.exports = leaderRouter;


