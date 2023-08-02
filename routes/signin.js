const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function(req, res, next) {
    res.render('signin', {
        title: 'Sign in'
    });
});

router.post('/', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    knex("users")
        .where({name:username, password:password})
        .select("*")
        .then((results) => {
            if (results.length == 0) {
                console.log("User is not found!");
                res.render("signin", {
                    title: "Sign in",
                    errorMessage: ["User is not found!"]
                });
            } else {
                console.log("The handling of sign-in works porperly!");
                req.session.userid = results[0].id;
                console.log(req.session.userid);
                res.redirect('/');
            }
        })
        .catch(function(err) {
            console.log("An error has occured!");
            console.error(err);
            res.render("signin", {
                title: "Sign in",
                errorMessage: [err.sqlMessage],
                isAuth: false
            });
        });
});

module.exports = router;