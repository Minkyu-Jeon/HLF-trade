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

// // update a UsedThing
// router.put(
//   '/:channelName/:chainCodeName/:id',
//   UsedThingController.update
// )

// router.delete(
//   '/:channelName/:chainCodeName/:id',
//   UsedThingController.destroy
// )

// router.post(
//   '/:channelName/:chainCodeName/:id',
//   UsedThingController.transfer
// )


module.exports = router;
