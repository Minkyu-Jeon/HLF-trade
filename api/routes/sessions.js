const express = require('express');
const validate = require('express-validation');

const SessionController = require('../controllers/session/session.controller')
const SessionValidator = require('../controllers/session/session.validator')

const router = express.Router();

/* POST session creating. */
router.post(
  '/',
  validate(SessionValidator.login),
  SessionController.login
);
router.get(
  '/info',
  SessionController.info
);


module.exports = router;
