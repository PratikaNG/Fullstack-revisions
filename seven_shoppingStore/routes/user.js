const express = require("express")
const router = express.Router()
const { signup,login,logout,forgotPassword,resetPassword } = require("../controllers/userController.js")


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);

module.exports = router;