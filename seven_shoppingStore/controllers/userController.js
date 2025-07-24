// 1. wrap the controller into BigPromise
// 2. check the requirements and bring in custom error is required
const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")
const User = require("../models/user")
const cookieToken = require("../utils/cookieToken")

exports.signup = BigPromise(async(req,res,next)=>{
     const {name, email,password} = req.body

     if(!email || !name || !password){
          // next is used since it is a util
          return next(new customError("Name, email, password are required.",400))
          // can use classic error as below, it only takes error message.
          // return next(new Error("Please end email.")) 
     }

     // 3. create a user that takes name, email and password
     const user = await User.create({
          name,
          email,
          password
     })

     // 4. Send a cookie value since the user has successfully registered
     cookieToken(user,res)
})