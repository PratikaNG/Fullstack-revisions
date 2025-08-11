// 1.
const express = require('express');
require("dotenv").config()
const app = express();

// 8
const passportConfig = require("./passport/passport")
const passport = require('passport')
app.use(passport.initialize());
// 6. 
const auth = require('./routes/authRoute')

//3. setup ejs view engine
app.set('view engine','ejs')

// 4.
app.get('/',(req,res)=>{
    res.render("home")
})
// 5.
const connectWithDB = require('./config/database')
connectWithDB();

// 7. middleware
app.use('/auth',auth)

// 2.
app.listen('4000',console.log("Server is running at port 4000.."));