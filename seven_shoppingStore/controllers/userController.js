// 1. wrap the controller into BigPromise
// 2. check the requirements and bring in custom error is required
const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")
const User = require("../models/user")
const cookieToken = require("../utils/cookieToken")
const cloudinary = require("cloudinary").v2
const mailHelper = require("../utils/mailHelper")
const crypto = require('crypto')

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
     let file = req.files.photo;  
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

exports.logout = BigPromise(async(req,res,next)=>{
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

exports.forgotPassword = BigPromise(async(req,res,next)=>{
     const {email} = req.body

     if(!email){
          return next(new customError("Email is required",404))
     }

     const user = await User.findOne({email})
     if(!user){
          return next(new customError("Email not found",400))
     }

     const forgotToken = user.getForgotPasswordToken()
     await user.save({validateBeforeSave:false})

     const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`
     console.log("myURL: ",myUrl)
     const message = `Please copy paste this link in your URl and hit enter \n \n ${myUrl} `
     try {
          // fix mailtrap account, to recieve the mail
          // await mailHelper({
          //      toEmail: user.email,
          //      subject: `Reset password url`,
          //      message
          // })
          res.status(200).json({
               success:true,
               message
          })
     } catch (error) {
          user.forgotPasswordToken = undefined;
          user.forgotPasswordExpiry = undefined;
          await user.save({validateBeforeSave:false})
          console.log("Here-3",error)
          return next(new customError(error.message,500))
     }

})

exports.resetPassword = BigPromise(async(req,res,next)=>{
     // 1. grab the token
     // 2. encrypt the token
     // 3. find user based on encrypted token
     // 4. make sure to only find the user who has asked to reset password
     // 5. If user not found, throw an error
     const token = req.params.token

     const encryptedtoken = crypto
     .createHash('sha256')
     .update(token)
     .digest('hex');

     const user = await User.findOne({
          encryptedtoken,
          forgotPasswordExpiry: {$gt: Date.now()}   
     });
     //$gt implies time greater than.
     //forgotPasswordExpiry:{$gt: Date.now()} implies time greater than Date.now()
     console.log("User",user)
     if(!user){
          return next(new customError("Token is invalid or expired",400))
     }

     if(req.body.password !== req.body.confirmPassword){
          return next(new customError("Password and confirm password do not match",400))
     }

     user.password = req.body.password
     user.forgotPasswordToken = undefined;
     user.forgotPasswordExpiry = undefined;
     await user.save();

     // send a token or json response
     cookieToken(user,res)
})

exports.getLoggedInUserDetails = BigPromise(async(req,res,next)=>{
     // 1. Only for user that's logged in
     // 2. Find the user by id
     const user = await User.findById(req.user.id)
     res.status(200).json({
          success: true,
          user,
     })
})

exports.changePassword = BigPromise(async(req,res,next)=>{
     const userId = req.user.id;
     const user = await User.findById(userId).select("+password");

     // 1. Accept old and new password
     // 2. Check if old password is correct
     // 3. Id correct then update the password with newpassword
     // 4. Save the user
     // 5. update cokieToken
     const isCorrectOldPassword = await user.isPasswordValid(req.body.oldPassword)
     if(!isCorrectOldPassword){
          return next(new customError("Old password is incorrect",404))
     }
     user.password = req.body.newPassword;

     await user.save();

     cookieToken(user,res);

})

exports.updateUserDetails = BigPromise(async(req,res,next)=>{
     // 1. Fetch the user
     // 2. Send res
          console.log("Came here")

     // check the fields
     const newData = {
          name : req.body.name,
          email : req.body.email,
     }
     // check if photo is being updated

     if(req.files !== ''){
          // find imageId.
          const user = await User.findById(req.user.id);
          const imageId = user.photo.id;
          // destroy from cloudinary
          const response = await cloudinary.uploader.destroy(imageId);
          
          // upload the new photo
          let file = req.files.photo; 
          const result = await cloudinary.uploader.upload(file.tempFilePath,{
               folder:"users",
               width:150,
               crop:"scale"
          })

          newData.photo = {
               id: result.public_id,
               secure_url: result.secure_url
          }


     }

     const user = await User.findByIdAndUpdate(req.user.id, newData, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
     })

     res.status(200).json({
          success: true,
     })

})


