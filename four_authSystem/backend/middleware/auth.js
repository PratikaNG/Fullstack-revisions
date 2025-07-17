// verify the token
const jwt = require("jsonwebtoken")

const auth = (req,res,next) =>{
    // grab/access the token from all possible places and then replace it by " "
    const token = req.cookies.token || 
    req.body.token ||
    req.header('Authorization').replace('Bearer ','');

    console.log("cookies",req.cookies)
    if(!token){
        // if token is absent
        return res.status(403).send("Token is missing.")
    }

    try {
        // if token is present, then verify if its valid
        const decodedToken = jwt.verify(token,process.env.SECRET_KEY)
        console.log("decodedToken",decodedToken)
        req.user = decode
        
    } catch (error) {
        // if token is present but there is error
        return res.status(403).send("Invalid token.")
    }
    return next()
}

module.exports = auth