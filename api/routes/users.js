const express = require('express');
const validate = require('express-validation')

const UserController = require('../controllers/user/user.controller')
const UserValidator = require('../controllers/user/user.validator')

const router = express.Router();

/* POST users creating. */
router.post(
  '/', 
  validate(UserValidator.signUp), 
  UserController.signUp,
);

router.post(
  '/enroll',
  UserController.enroll
)

module.exports = router;
