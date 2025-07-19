// 1. write the app and run
const express = require('express')
const Razorpay = require('razorpay')
const app = express()
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.status(200).send("Hi there!")
// })

// 2.payment gateway route
app.post('/orders',async (req,res)=>{
    // only be responsible for deducting the payment
    // later while creating the order we can match whether the amount thats being sent to us while processing is the exact amount or not
    const amount = req.body.amount

    // from: https://razorpay.com/docs/api/orders/create/
    var instance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })

    const myOrder = await instance.orders.create({
    amount: amount * 100,  //amount to be deducted in the smallest currency unit
    currency: "INR",
    receipt: "receipt#1",
    notes: {
        key1: "value3",
        key2: "value2"
    }
    })

    res.status(201).json({
        success:true,
        amount,
        order:myOrder
    })

    
})



app.listen(4000,(req,res)=>{console.log("App is listening to port 4000")})