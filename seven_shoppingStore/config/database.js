const mongoose = require("mongoose")
const {MONGODB_URL} = process.env

const connectWithDB = ()=>{
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology: true    
    })
    .then(res=>{
        console.log("DB connection success.")
    })
    .catch(err =>{
         console.log("DB connection failed.")
         console.log("DB error: ",err)
         process.exit(1)
    })
}

module.exports = connectWithDB