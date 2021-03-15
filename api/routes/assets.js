const express = require('express');
const validate = require('express-validation')

const AssetController = require('../controllers/asset/asset.controller')
const AssetValidator = require('../controllers/asset/asset.validator')

const router = express.Router();

// Register asset
router.post(
  '/', 
  validate(AssetValidator.register), 
  AssetController.register,
);

// Get all the assets
router.get(
  '/:channelName/:chainCodeName', 
  AssetController.index,
);

// Get a asset
router.get(
  '/:channelName/:chainCodeName/:id',
  AssetController.show
)

// update a asset
router.put(
  '/:channelName/:chainCodeName/:id',
  AssetController.update
)

router.delete(
  '/:channelName/:chainCodeName/:id',
  AssetController.destroy
)

router.post(
  '/:channelName/:chainCodeName/:id',
  AssetController.transfer
)


module.exports = router;
