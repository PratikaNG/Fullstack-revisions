const express = require("express")
const router = express.Router()
const {createOrder,getOneOrder,getLoggedInOrders,adminGetAllOrders,adminUpdateOrder,deleteOrder} = require("../controllers/orderController")
const {isLoggedIn, customRole} = require("../middlewares/userMiddleware.js");

router.route("/order/create").post(isLoggedIn,createOrder)
router.route("/order/:id").get(isLoggedIn,getOneOrder)
router.route("/myOrder").get(isLoggedIn,getLoggedInOrders)

// adminRoutes
router.route("/admin/orders").get(isLoggedIn,customRole('admin'),adminGetAllOrders)
router.route("/admin/order/:id").put(isLoggedIn,customRole('admin'),adminUpdateOrder)
router.route("/admin/order/:id").delete(isLoggedIn,customRole('admin'),deleteOrder)

module.exports = router