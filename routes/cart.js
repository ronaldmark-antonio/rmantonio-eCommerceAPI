const express = require('express');
const cartController = require('../controllers/cart');
const auth = require("../auth")

const { verify } = auth;

const router = express.Router();

router.get('/get-cart', verify, cartController.getCart)

module.exports = router;