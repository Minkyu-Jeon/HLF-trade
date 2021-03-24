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
  '/:serial_number/:product_name',
  UsedThingController.show
)

router.post(
  '/:serial_number/:product_name/buy_request',
  UsedThingController.buyRequest
)

router.post(
  '/:serial_number/:product_name/send',
  UsedThingController.sendThing
)

router.post(
  '/:serial_number/:product_name/receive',
  UsedThingController.receiveThing
)

router.post(
  '/:serial_number/:product_name/confirm',
  UsedThingController.confirmThing
)

module.exports = router;
