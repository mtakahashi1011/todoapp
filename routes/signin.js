const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    const userId = req.session.userid;
    const isAuth = Boolean(userId);
    res.render('signin', {
        title: 'Sign in',
        isAuth: isAuth
    });
});

router.post('/', function(req, res, next) {
    const userId = req.session.userid;
    const isAuth = Boolean(userId);
    const username = req.body.username;
    const password = req.body.password;
    console.log(password);

    knex("users")
        .where({name:username})
        .select("*")
        .then(async function (results) {
            // const comparedPassword = await bcrypt.compare(password, results[0].password);
            // console.log(comparedPassword);
            console.log(results[0].password);
            if (results.length == 0) {
                console.log("The user is not found!");
                res.render("signin", {
                    title: "Sign in",
                    errorMessage: ["The user is not found!"],
                    isAuth: isAuth
                });
            } else if (await bcrypt.compare(password, results[0].password)) {
                console.log("The handling of sign-in works properly!");
                req.session.userId = results[0].id;
                res.redirect('/');
            } else {
                console.log("The password does not match!");
                res.render("signin", {
                    title: "Sign in",
                    errorMessage:  ["The password does not match!"],
                    isAuth: isAuth
                });
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