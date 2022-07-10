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
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const member = new Member(
          {
            first_name: req.body.first_name,
            surname: req.body.surname,
            username: req.body.username,
            password: hashedPassword
          }
        );
        await member.save()
        res.redirect('/log-in');
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

exports.join_club_get = (req, res, next) => {
  if (res.locals.currentUser) {
    res.render('join_club');
  } else {
    res.redirect('log-in');
  }
};

exports.join_club_post = [
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .escape(),
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.render('join_club', { errors: error.array() })
    } else {
      try {
        if (req.body.password === process.env.CLUB_KEY) {
          await Member.updateOne({ _id: res.locals.currentUser }, { membership_status: 'member' });
          res.redirect('/');
        } else {
          res.redirect('/join-club');
        }
      } catch (err) {
        next(err);
      }
    }
  }
];

exports.become_admin_get = (req, res, next) => {
  if (res.locals.currentUser && !res.locals.currentUser.admin) {
    res.render('admin_form');
  } else {
    res.redirect('/');
  }
};

exports.become_admin_post = [
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .escape(),
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.render('admin_form', { errors: error.array() })
    } else {
      try {
        if (req.body.password === process.env.ADMIN_KEY) {
          await Member.updateOne({ _id: res.locals.currentUser }, { admin: true });
          res.redirect('/');
        } else {
          res.redirect('/secret-admin-page');
        }
      } catch (err) {
        next(err);
      }
    }
  }
];
