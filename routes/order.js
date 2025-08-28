const express = require('express');
const orderController = require('../controllers/order');
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post('/checkout', verify, orderController.createOrder)
router.get('/my-orders', verify, orderController.getOrder)

module.exports = router;
