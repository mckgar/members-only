const { body, validationResult } = require('express-validator');

const Message = require('../models/message');
const Member = require('../models/member');

exports.new_message_get = (req, res, next) => {
  if (res.locals.currentUser) {
    res.render('message_form');
  } else {
    res.redirect('/log-in');
  }
};

exports.new_message_post = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message cannot be empty')
    .escape(),
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.render('message_form', { title: req.body.title, message: req.body.message, errors: error.array() });
    } else {
      try {
        const message = new Message(
          {
            title: req.body.title,
            content: req.body.message,
            author: res.locals.currentUser._id
          }
        );
        await message.save();
        res.redirect('/');
      } catch (err) {
        next(err);
      }
    }
  }
];
