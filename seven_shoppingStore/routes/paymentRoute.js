const express = require('express');
const router = express.Router();
const {isLoggedIn} = require("../middlewares/userMiddleware.js");
const { sendStripeKey,captureStripePayments,sendRazorPayKey,captureRazorPayPayments } = require('../controllers/paymentController.js');

router.route('/stripeKey').get(isLoggedIn,sendStripeKey)
router.route('/stripePayment').post(isLoggedIn,captureStripePayments)

router.route('/razorpayKey').get(isLoggedIn,sendRazorPayKey)
router.route('/razorpayPayment').post(isLoggedIn,captureRazorPayPayments)

module.exports = router