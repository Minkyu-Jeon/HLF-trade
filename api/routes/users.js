const express = require('express');
const validate = require('express-validation');
const UsedThingController = require('../controllers/used_thing/used_thing.controller');

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

router.get(
  '/:id/used_things/sellings',
  UsedThingController.selling
)

router.get(
  '/:id/used_things/buyings',
  UsedThingController.buying
)

module.exports = router;
