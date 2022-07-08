const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const Member = require('../models/member');

exports.sign_up_get = (req, res, next) => {
  res.render('sign_up_form');
};

exports.sign_up_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name is required'),
  body('surname')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Surname is required'),
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Username is required')
    .custom(async value => {
      try {
        const search = await Member.find({ username: value });
        if (search.length > 0) {
          return Promise.reject('Username already in use');
        }
      } catch (err) {
        next(err);
      }
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be length 8 or more')
    .trim()
    .escape(),
  body('confirm-password')
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject('Passwords do not match');
      }
      return true;
    }),
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.render('sign_up_form', { first_name: req.body.first_name, surname: req.body.surname, username: req.body.username, errors: error.array() });
    } else {
      const hashedPassword = bcrypt.hash(req.body.password, 10);
      const member = new Member(
        {
          first_name: req.body.first_name,
          surname: req.body.surname,
          username: req.body.username,
          password: hashedPassword
        }
      );
      try {
        await member.save()
        res.redirect('/');
      } catch (err) {
        next(err);
      }
    }
  }
];

exports.log_in_get = (req, res, next) => {
  res.render('log_in_form');
};

exports.log_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in'
});

exports.log_out_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) next(err);
    res.redirect('/');
  })
};