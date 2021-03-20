const express = require('express');
const validate = require('express-validation')

const UsedThingController = require('../controllers/used_thing/used_thing.controller')
const UsedThingValidator = require('../controllers/used_thing/used_thing.validator')

const router = express.Router();

// Register UsedThing
router.post(
  '/', 
  validate(UsedThingValidator.register), 
  UsedThingController.register,
);

// Get all the UsedThings
router.get(
  '/', 
  UsedThingController.index,
);

// Get a UsedThing
router.get(
  '/:id',
  UsedThingController.show
)

router.post(
  '/:id/buy_request',
  UsedThingController.buyRequest
)

router.post(
  '/:id/send',
  UsedThingController.sendThing
)

router.post(
  '/:id/receive',
  UsedThingController.receiveThing
)

router.post(
  '/:id/confirm',
  UsedThingController.confirmThing
)

module.exports = router;
