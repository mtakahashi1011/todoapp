const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const knex = require('../db/knex');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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
  knex("tasks")
    .select("*")
    .then(function (results) {
      console.log(results);
      res.render('index', {
        title: 'ToDo App',
        todos: results
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App'
      });
    });
});

router.post('/', function(req, res, next) {
  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
  })
  const todo = req.body.add;
  connection.query(`INSERT INTO tasks (user_id, content) VALUES (1, '${todo}');`,
    (error, results) => {
      console.log(error);
      res.redirect('/');
    }
  );
});

router.use('/signup', require('./signup'));

module.exports = router;
