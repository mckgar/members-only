const express = require('express');
const router = express.Router();

const Message = require('../models/message');

const member_controller = require('../controllers/memberController');
const message_controller = require('../controllers/messageController');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find().populate('author');
    res.render('index', { messages: messages });
  } catch (err) {
    next(err)
  }
});

router.get('/sign-up', member_controller.sign_up_get);
router.post('/sign-up', member_controller.sign_up_post);
router.get('/log-in', member_controller.log_in_get);
router.post('/log-in', member_controller.log_in_post);
router.get('/log-out', member_controller.log_out_get);

router.get('/join-club', member_controller.join_club_get);
router.post('/join-club', member_controller.join_club_post);

router.get('/secret-admin-page', member_controller.become_admin_get);
router.post('/secret-admin-page', member_controller.become_admin_post);

router.get('/new-message', message_controller.new_message_get);
router.post('/new-message', message_controller.new_message_post);
router.post('/delete-message', message_controller.delete_message_post);

module.exports = router;
