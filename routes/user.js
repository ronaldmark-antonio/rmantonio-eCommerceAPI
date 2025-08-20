<<<<<<< HEAD
// Depencies and Modules
const express = require('express');
const userController = require('../controllers/user');
const { verify } = require("../auth");

// Routing Component
const router = express.Router();

// User registration
router.post("/register", userController.registerUser)

// User authentication
router.post("/login", userController.loginUser);

module.exports = router;
=======
express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.get("/details", verify, userController.getUserDetails);
router.patch("/update-password", verify, userController.updatePassword);

// Routes with parameters
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

module.exports = router;
>>>>>>> 7345f9102b5997ef7f85dd7a34c7055192959a58
