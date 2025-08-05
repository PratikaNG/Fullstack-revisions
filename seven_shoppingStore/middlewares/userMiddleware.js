const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")
const User = require("../models/user")
const JWT = require("jsonwebtoken")

exports.isLoggedIn = BigPromise(async(req,res,next)=>{
    // 1. Fetch the token
    // 2. Grab info from token using JWT -> verify the token
    // 3. Find the user by id
    // 4. next()
    const token = req.cookies.token ||  req.header('Authorization').replace('Bearer ','');
    if(!token){
        return next(new customError("Login first to access this page",401));
    }
    const decoded = JWT.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next();

})

exports.customRole = (...roles)=>{
    // return a true or false value
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new customError("You are not allowed for this resource",403)) 
        }
        next();
    }
}