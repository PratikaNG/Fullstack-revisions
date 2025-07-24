const cookieToken = (user,res)=>{
const token =user.getJwtToken()
     const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true
     }
     user.password = undefined //we donot want to show the password in the response
     res.status(200).cookie('token',token,options).json({
          success: true,
          token,
          user
          // sending this json response so that the if the signup is being done from mobile then the token can be stored by frontend
     })
}



module.exports = cookieToken