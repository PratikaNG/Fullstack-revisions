const mongoose = require("mongoose");

const connectWithDB = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
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