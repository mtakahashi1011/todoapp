const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
    const userId = req.session.userId;
    const isAuth = Boolean(userId);
    res.render('signup', {
        title: 'Sign up',
        isAuth: isAuth
    });
});

router.post('/', function (req, res, next) {
    console.log(req);
    //console.log(req.body);
    const userId = req.session.userId;
    const isAuth = Boolean(userId);
    const username = req.body.username;
    const password = req.body.password;
    const repassword = req.body.repassword;

    knex("users")
        .where({name: username})
        .select("*")
        .then(async function(result) {
            if (result.length !== 0) {
                console.log("This username is already used!");
                res.render("signup", {
                    title: "Sign up",
                    errorMessage: ["This username is already used"],
                    isAuth: isAuth
                });
            } else if (password == repassword) {
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log(hashedPassword);
                knex("users")
                    .insert({name: username, password: hashedPassword})
                    .then(function() {
                        res.redirect("/");
                    })
                    .catch(function(err) {
                        console.log("An error is occured!")
                        console.error(err);
                        res.render("signup", {
                            title: "Sign up",
                            errorMessage: [err.sqlMessage],
                            isAuth: isAuth
                        });
                    });
            } else {
                console.log("Passwords do not match!");
                res.render("signup", {
                    title: "Sign up",
                    errorMessage: ["Passwords do not match"],
                    isAuth: isAuth
                });
            }
        })
        .catch(function(err) {
            console.log("An error is occured!!")
            console.error(err);
            res.render("signup", {
                title: "Sign up",
                errorMessage: [err.sqlMessage],
                isAuth: isAuth
            });
        });
});

module.exports = router;