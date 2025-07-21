//1. controllers export everything written in it
// exports.home = (req,res)=>{
//     res.status(200).json({
//         success:true,
//         greeting: "Hi there!"
//     })
// }
// 2. wrap controllers into big Promise
const BigPromise = require("../middlewares/bigPromise")
// below is the way to wrap up a controller into BigPromise
exports.home = BigPromise(
    (req,res)=>{
    res.status(200).json({
        success:true,
        greeting: "Hi there!"
    })
}
)

// if you do not use BigPromise, you will have to use async,await,try,catch as below in every controller function, which makes it lengthy
exports.dummy = async(req,res)=>{
   try {
    // const db = await something()
     res.status(200).json({
        success:true,
        greeting: "Its dummy!"
    })
   } catch (error) {
    
   }
}

