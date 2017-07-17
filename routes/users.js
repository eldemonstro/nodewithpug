const express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('users/register', {
    errors: null,
    title: 'User Registration'
  });
});

router.post('/register', function(req, res, next) {
  let body = req.body;

  req.assert('name', 'Name is required').notEmpty();
  req.assert('password', 'Password is required').notEmpty();
  req.assert('email', 'Email is required').notEmpty();
  req.assert('email', 'Email is not valid').matches(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  req.assert('password2', 'Confirm password is required').notEmpty();
  req.assert('password2', 'Passwords not equals').equals(body.password);
  req.assert('password', 'Password needs 8 characters, and at least a letter and a number').matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/i);

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      errors = result.array();
      res.render('users/register', {
        title: 'User Registration',
        errors: errors
      });
      return;
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      bcrypt.hash(body.password, salt, (err, hash) => {
        if (err) {
          res.status(500).send(err);
          return;
        }

        User.find({}).then((docs) => {
          let userExists = docs.find(doc => {
            return doc.email == body.email;
          });
          if (userExists) {
            res.render('users/register', {
              title: 'User Registration',
              errors: [{
                msg: 'User already exists'
              }]
            });
            return;
          }
          let userToSave = {};
          userToSave.name = body.name;
          userToSave.email = body.email;
          userToSave.password = hash;
          userToSave.smallId = (docs.length + 1);
          User.create(userToSave)
            .then((userToSave) => {
              console.log(userToSave);
              req.flash('success', "Register successful, you may now login");
              res.redirect('/user/login');
              return;
            }, (err) => {
              res.status(500).send(err);
              return;
            });
        }, (err) => {
          res.status(500).send(err);
          return;
        });
      });
    });
  });
});

router.get('/login', function(req, res) {
  res.render('users/login', {
    title: 'Login',
    errors: null
  });
});

module.exports = router;
