const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")
const {stripe} = require("stripe")(process.env.STRIPE_SECRET  )

exports.sendStripeKey = BigPromise(async(req,res,next)=>{
    // send res
    res.status(200).json({
        stripe_key: process.env.STRIPE_API_KEY  //its safe to give this key, but not STRIPE_SECRET
    })
})

exports.captureStripePayments = BigPromise(async(req,res,next)=>{

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency:'inr',

        // optional
        metadata:{inegration_check: 'accept_a_paymeny'}
    })
    // send res
    res.status(200).json({
        success: true,
        amount: req.body.amount,
        client_secret: paymentIntent.client_secret
        // you can optionally send id too.
    })
})
exports.sendRazorPayKey = BigPromise(async(req,res,next)=>{
    // send res
    res.status(200).json({
        stripe_key: process.env.RAZORPAY_API_KEY  
    })
})

exports.captureRazorPayPayments = BigPromise(async(req,res,next)=>{

    var instance = new Razorpay({ key_id: 'YOUR_RAZORPAY_API_KEY_ID', key_secret: 'YOUR_RAZORPAY_SECRET' })
    const options = {
        amount: req.body.amount,
        currency: "INR",
    }
    const myOrder = await instance.orders.create({options})
    // send res
    res.status(200).json({
        success: true,
        amount: req.body.amount,
        order: myOrder
        
    })
})