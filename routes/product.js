const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/", verify, verifyAdmin, productController.createProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProducts);
router.get("/active", productController.getAllActive);
router.get("/:productId", productController.getProduct);

module.exports = router;