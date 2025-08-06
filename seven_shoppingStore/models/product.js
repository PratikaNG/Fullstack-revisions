const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please provide product name'],
        trim: true,
        maxlength: [120,'Product name should not be more than 120 characters.']
    },
    price:{
        type: Number,
        required: [true,'Please provide product price'],
        trim: true,
        maxlength: [5,'Product name should not be more than 120 characters.']
    },
    description:{
        type: String,
        required: [true,'Please provide product description'],
        trim: true,
    },
    photos:[
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            },
        }
    ],
    category:{
        type: String,
        required: [true,'Please select category from- tshirt, short-sleeves, long-sleeves, hoodies'],
        enum:{
            values:[
                'tshirt',
                'shortsleeves',
                'longsleeves',
                'hoodies'
            ],
            message:'Please select category onlyfrom- tshirt, short-sleeves, long-sleeves, hoodies'
        }
    },
    brand:{
        type: String,
        required: [true,'Please provide brand for the clothing'],
    },
    ratings:{
        type: Number,
        default: 0
    },
    numberOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            // injecting other document value into other
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            user: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Product',productSchema)