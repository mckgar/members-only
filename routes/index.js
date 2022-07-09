const express = require('express');
const router = express.Router();

const member_controller = require('../controllers/memberController');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', member_controller.sign_up_get);
router.post('/sign-up', member_controller.sign_up_post);
router.get('/log-in', member_controller.log_in_get);
router.post('/log-in', member_controller.log_in_post);
router.get('/log-out', member_controller.log_out_get);

router.get('/join-club', member_controller.join_club_get);
router.post('/join-club', member_controller.join_club_post);

module.exports = router;
