express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.get("/details", verify, userController.getUserDetails);
router.patch("/update-password", verify, userController.updatePassword);

// Routes with parameters
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

module.exports = router;
