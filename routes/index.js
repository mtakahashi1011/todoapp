const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const knex = require('../db/knex');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'todoapp',
  password: 'password',
  database: 'todo_app'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return
  }
  console.log('success');
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   connection.query(`SELECT * FROM tasks;`,
//     (error, results) => {
//       console.log(error);
//       console.log(results);
//       res.render('index', {
//         title: 'ToDo App',
//         todos: results
//       });
//     }
//   );
// });

router.get('/', function(req, res, next) {
  const userId = req.session.userId;
  console.log(userId);
  const isAuth = Boolean(userId);
  console.log(`isAuth: ${isAuth}`);

  knex("tasks")
    .select("*")
    .where({user_id: userId})
    .then(function (results) {
      console.log(results);
      res.render('index', {
        title: 'ToDo App',
        todos: results,
        isAuth: isAuth
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth
      });
    });
});

// router.post('/', function(req, res, next) {
//   connection.connect((err) => {
//     if (err) {
//       console.log('error connecting: ' + err.stack);
//       return;
//     }
//     console.log('success');
//   })
//   const todo = req.body.add;
//   connection.query(`INSERT INTO tasks (user_id, content) VALUES (1, '${todo}');`,
//     (error, results) => {
//       console.log(error);
//       res.redirect('/');
//     }
//   );
// });

router.post('/', function(req, res, next) {
  const userId = req.session.userId;
  const isAuth = Boolean(userId);
  const todo = req.body.add;
  knex("tasks")
    .insert({user_id: userId, content:todo})
    .then(function() {
      res.redirect('/');
    })
    .catch(function(err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;
