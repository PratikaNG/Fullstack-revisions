const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')  //default package form express
// 1. write the userSchema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please provide a name.'],
        maxlength: [40,'Name should be under 40 characters.'],
    },
    email:{
        type: String,
        required: [true,'Please provide an email.'],
        validate: [validator.isEmail,'Please enter email in correct format.'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'Please provide a password.'],
        minlength:[6,'Password should be atleast 6 characters.'],
        select: false //whenever we select a particluar model the password feild will not come here.
    },
    role:{
        type: String,
        default: 'user',
    },
    photo:{
        id:{
            type: String,
            required: true,
        },
        secure_url:{
            type: String,
            required: true,
        },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createAt:{
        type: Date,
        default: Date.now  //it shouldnt be Date.now()
    }
})


//2. password encryption before save

userSchema.pre('save',async function(){
    // if password field is not modified/touched then go ahead and do next
    if(!this.isModified('password')){
        return next
    }
    // if password field is modified/touched then encrypt it using bcryptjs
    this.password = await bcrypt.hash(this.password, 10)
})

// 3.Validate the password with passed on user password
userSchema.methods.isPasswordValid = async function(usersentPassword){
    return await bcrypt.compare(usersentPassword,this.password)
}

// 4.create and return jwt token
userSchema.methods.getJwtToken = function(){
    // syntax for creating a jwt token is jwt.sign({payload,secret,options{expiresIN}})
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}


// 5. generate forgotPassword token -> string
userSchema.methods.getForgotPasswordToken = function(){
    // generate a long random string

    // a. simpler way
    // const forgotToken = crypto.randomBytes(20).toString('hex')
    // this.forgotPasswordToken = forgotToken

    // b.a step further -> sha256 is better algorithm
    const forgotToken = crypto.randomBytes(20).toString('hex')
    // getting a hash -> means make sure to get a hash on the backend, the below is getting stored in the db.We need to compare the value that user sends by running the same crypto function below and check if they are same

    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
    this.forgotPasswordExpiry = Date.now() + 20 * 60 *1000  //20minutes
    return forgotToken
}

module.exports = mongoose.model("User",userSchema)