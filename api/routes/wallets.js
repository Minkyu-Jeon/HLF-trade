const express = require('express');
const validate = require('express-validation')

const WalletController = require('../controllers/wallet/wallet.controller')

const router = express.Router();

/* POST users creating. */
router.post(
  '/', 
  WalletController.create,
);



module.exports = router;
