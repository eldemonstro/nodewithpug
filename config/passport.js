const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      User.findOne({
          email: email
        },
        (err, user) => {
          if (!user) {
            return done(null, false, {
              message: 'No user found'
            });
          }

          bcrypt.compare(password, user.password, function(err, isMatch) {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: 'Wrong password'
              });
            }
          });
        }
      );
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
