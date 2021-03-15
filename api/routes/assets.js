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


module.exports = router;
