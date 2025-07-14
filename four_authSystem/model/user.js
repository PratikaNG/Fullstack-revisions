const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname:{
        type:string,
        required:true,
        default:null
    },
    lastname:{
        type:string,
        required:true,
        default:null
    },
    email:{
        type:string,
        unique:true,
    },
    password:{
        type:string,
    },
    token:{
        type:string,
    },
    
})

module.exports = mongoose.model('user',userSchema)