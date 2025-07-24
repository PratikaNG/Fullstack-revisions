// 1. wrap the controller into BigPromise
// 2. check the requirements and bring in custom error is required
const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")
const User = require("../models/user")
const cookieToken = require("../utils/cookieToken")
const cloudinary = require("cloudinary").v2

exports.signup = BigPromise(async(req,res,next)=>{
     // let result ;
     

     const {name,email,password} = req.body

     if(!email || !name || !password){
          // next is used since it is a util
          return next(new customError("Name, email, password are required.",400))
          // can use classic error as below, it only takes error message.
          // return next(new Error("Please end email.")) 
     }

     if(!req.files){
          return new customError("Photo is required for signup",400)
     }
     let
          file = req.files.photo;  
           //frontend should know that they should send the images on "photo" field
           const result = await cloudinary.uploader.upload(file.tempFilePath,{
               folder:"users",
               width:150,
               crop:"scale"
          })

     // 3. create a user that takes name, email and password
     const user = await User.create({
          name,
          email,
          password,
          photo:{
               id:result.public_id,
               secure_url: result.secure_url
          }
     })

     // 4. Send a cookie value since the user has successfully registered
     cookieToken(user,res)
})