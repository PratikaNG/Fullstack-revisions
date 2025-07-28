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

exports.login = BigPromise(async(req,res,next)=>{
     // 1. Fetch the email and password
     // 2. Check if the user with that email exists in the db
     // 3. Check if password is valid
     // 4. If email and password exists then generate the token
     // 5. Use the login route in user route file and test it
     // 6. Note:User.findOne({email}).select("+ password")-> this is because in user model, while defining the password field we have sset the select to false which results in it not showing the password unless queried this way.

     const {email,password} = req.body
     if(!email || !password){
          return next(new customError("Please enter email or password",404))
     }

     const user = await User.findOne({email}).select("+ password")

     if(!user){
          return next(new customError("User does not exists",400))
     }

     // if user exists
     const validPassword = await user.isPasswordValid(password)

     if(!validPassword){
           return next(new customError("Password doesnt match",404))
     }

     // if email and password are valid and user exists
     cookieToken(user,res)
})

exports.logout = BigPromise((req,res,next)=>{
     // 1. clear the token as in set it to null and set its expiry to Date.now()
     // 2. send out the response for confirmation
     // 3. set up the logout route in user route and test it as a get request

     res.cookie('token',null,{
          expires: new Date(Date.now()),
          httpOnly:true
     }) 
     res.status(200).json({
          success:true,
          message:"Logged out successfully."
     })
})
