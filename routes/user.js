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