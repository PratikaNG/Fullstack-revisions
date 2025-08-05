const express = require("express")
const router = express.Router()
const { signup,login,logout,forgotPassword,resetPassword,getLoggedInUserDetails,changePassword,updateUserDetails,
    adminAllUser,managerAllUser,adminGetSingleUser,adminUpdateOneUserDetails,adminDeleteOneUser } = require("../controllers/userController.js")
const {isLoggedIn, customRole} = require("../middlewares/userMiddleware.js")

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userDashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn,changePassword);
router.route("/userDashboard/update").post(isLoggedIn,updateUserDetails);

// admin only route-  //only admin can access this route
router.route("/admin/users").get(isLoggedIn,customRole('admin'),adminAllUser);
router.route("/admin/user/:id").get(isLoggedIn,customRole('admin'),adminGetSingleUser); 
router.route("/admin/user/:id").put(isLoggedIn,customRole('admin'),adminUpdateOneUserDetails); 
router.route("/admin/user/:id").delete(isLoggedIn,customRole('admin'),adminDeleteOneUser); 

// manager only route-//only manager can access this route
router.route("/manager/users").get(isLoggedIn,customRole('manager'),managerAllUser); 

module.exports = router;