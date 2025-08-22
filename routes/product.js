const express = require('express');
const productController = require('../controllers/product');
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

module.exports = router;
