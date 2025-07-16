require('dotenv').config()
require("./config/databse.js").connect()  //running database connection
const express = require('express');
const app = express();
// Express cannot handle the json file directly so we need to do
app.use(express.json()) 
const User = require("./model/user.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth.js")
const {SECRET_KEY} = process.env
app.get('/',(req,res)=>{
    res.send("Welcome")
})

app.post('/register',async (req,res)=>{
    try {
        const {firstname, lastname, email, password} = req.body

    if(!(firstname && lastname && email && password)){
        res.status(400).send("All fields are required")
    }
    // checking if user already exists
    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(401).send("User already exisits")
    }
    // encrypt the password
    const encryptedUserPassword = await bcrypt.hash(password,10)

    const user = await User.create({firstname,lastname,email:email.toLowerCase(),password:encryptedUserPassword})
    // once the user is created it gives an id saying user._id
    // create a token -> install jsonwebtoken
    // creating jwt -> jwt.sign(payload,secret key,expiresIN)
    const tokenJWT = jwt.sign({user_id:user._id},SECRET_KEY,{expiresIn:"2h"})
    // store the token into user
    user.token = tokenJWT
    // handling password situation since we do not want to send it in the response
    user.password = undefined
    res.status(201).send(user)
    } catch (error) {
        console.log("error",error)
    }
})

app.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!(email && password)){
            res.send("Field is missing.")
            
        }
        const user = await User.findOne({email})
        const passwordMatch = await bcrypt.compare(password,user.password)
        // 1. If user is not there
        if(!user){
            res.send("You have not registered to our app.")
        }
        // 1. If user and password doesnt match
        if(!(user && passwordMatch)){
            res.status(400).send("Email or password is incorrect.")
        }
        // 1. If user is there and also the password matches -> generate a token and pass it on
        if(user && passwordMatch){
            const token = jwt.sign({user_id:user._id,email,password},SECRET_KEY,{expiresIn:"2h"})
            user.token = token
            user.password = undefined
            res.status(200).json(user)
        }


    } catch (error) {
        console.log("login err",error)
    }
})

// middleware
app.post('/dashboard',auth,(req,res)=>{
    res.send("Welcome to secret info")
})

module.exports = app