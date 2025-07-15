require('dotenv').config()
require("./config/databse.js").connect()  //running database connection
const express = require('express');
const app = express();
// Express cannot handle the json file directly so we need to do
app.use(express.json()) 
const User = require("./model/user.js")

app.get('/',(req,res)=>{
    res.send("Welcome")
})

app.post('/register',(req,res)=>{
    const {firstname,lastname,email,password} = req.body

    if(!(firstname && lastname && email && password)){
        res.status(400).send("All fields are required")
    }

    const existingUser = User.findOne({email})
    if(existingUser){
        res.send(401).send("User already exisits")
    }
})


module.exports = app