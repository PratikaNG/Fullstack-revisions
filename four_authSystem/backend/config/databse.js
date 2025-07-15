const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

// putting in exports.connect = ()=>{} function to export it like below
exports.connect = ()=>{
    mongoose.connect(MONGODB_URL,{
// connection options
useNewUrlParser:true,
useUnifiedTopology:true
})
// everything in monogoose returns a promise, hence handling the promise below
.then(console.log("DB CONNECTED SUCCESSFULLY"))
.catch(error=>{
    console.log("DB CONNECTION FAILED")
    console.log(error)
    process.exit(1)
})
}





// const mongoose = require('mongoose')
// const {MONGODB_URL} = process.env

// mongoose.connect(MONGODB_URL,{
// // connection options
// useNewUrlPareser:true,
// useUnifiedTopology:true
// })
// // everything in monogoose returns a promise, hence handling the promise below
// .then(console.log("DB CONNECTED SUCCESSFULLY"))
// .catch(error=>{
//     console.log("DB CONNECTION FAILED")
//     console.log(error)
//     process.exit(1)
// })






// const mongoose = require('mongoose')
// const {MONGODB_URL} = process.env

// mongoose.connect(MONGODB_URL,{

// })
// .then()
// .catch()