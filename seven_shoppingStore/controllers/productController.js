const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")
const Product = require("../models/product")
const cloudinary = require("cloudinary").v2
const WhereClause = require("../utils/wherClause")
// just testing
exports.testProduct = BigPromise(
    (req,res)=>{
    res.status(200).json({
        success:true,
        greeting: "This is a test for product!"
    })
})

exports.addProduct = BigPromise(async(req,res)=>{
    // 1. handle images
    let imagesArray = []
    if(!req.files ){
        return next(new customError('Images are required',401))
    }
    if(req.files){
        for(let index = 0; index < req.files.length; index++){
            const element = req.files.photos;
            const result = await cloudinary.uploader.upload(element.tempFilePath,{
                folder:"products",
            })
            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            })
        }
    }

    // 2. construct the necessary things for the body
    req.body.photos = imagesArray;
    req.body.user = req.user.id;

    // 3. create the product with all details given in the req body
    const product = await Product.create(req.body);

    // 4. send response
    res.status(200).json({
        success: true,
        product
    })
    
})

exports.getAllProducts = BigPromise(async(req,res,next)=>{
    // 1.Results per page
    // 2. import WhereClause to accept more things coming in.
    let resultsPerPage = 6;
     const totalProductCount = await Product.countDocuments() // fives product count from db.

    const productsObj = new WhereClause(Product.find(),req.query).search().filter();
    let products = await productsObj.base;
    const filteredProductCount = products.length

    productsObj.pager(resultsPerPage)
    products = await productsObj.base.clone();  //.clone needs to be added when there is chain of queries happening.

     res.status(200).json({
        success: true,
        products,
        filteredProductCount,
        totalProductCount
    })
})

exports.getSingleProduct = BigPromise(async(req,res,next)=>{
    const productId = req.params.product_id;
    const product = await Product.findById(productId);
    if(!product){
        return next(new customError('Product not found',404))
    }

    res.status(200).json({
        success: true,
        product
    })
})

exports.adminGetAllProducts = BigPromise(async(req,res,next)=>{
    const products = await Product.find({});
    if(!products){
        return next(new customError('No product found',404))
    }


    res.status(200).json({
        success: true,
        products
    })
})

exports.adminUpdateOneProduct = BigPromise(async(req,res,next)=>{
    const productId = req.params.product_id;
    let product = await Product.findById(productId);
    if(!product){
        return next(new customError('No product found',404))
    }
    if(!req.files){
        return next(new customError('Images are required',401))
    }
    
    let imagesArray = []
    if(req.files){
        // 1. Destroy exsisting images.
        
        for(index=0; index < product.photos.length; index ++){
            let element = await cloudinary.uploader.destroy(product.photos[index].id)
        }
        // 2. upload and save images
        for(index=0; index < product.photos.length; index ++){
            let res = await cloudinary.uploader.upload(product.photos[index].tempFilePath,{
                folder:"products"  //folder name can come from env file if necessary
            })
            imagesArray.push({
                id: res.public_id,
                secure_url:res.secure_url
            })
        }
    }

    req.body.photos = imagesArray
    product = await Product.findByIdAndUpdate(productId,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true,
        product
    })
})

exports.adminDeleteOneProduct = BigPromise(async(req,res,next)=>{
    // 1. Find the product
    const productId = req.params.product_id;
    const product = await Product.findById(productId);
    if(!productId){
        return next(new customError('No product found',404))
    }
    // 2. Destroy exsisting images.
        
        for(index=0; index < product.photos.length; index ++){
            const element = await cloudinary.uploader.destroy(product.photos[index].id)
        }

    //3. remove 
    // await product.remove();
    await Product.findByIdAndDelete(productId);
   
    res.status(200).json({
        success: true,
        message: "Product was deleted!",
        product
    })
})

exports.addReview = BigPromise(async(req,res,next)=>{
    const{rating,comment,productId} = req.body;

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    if(!product){
        return next(new customError("Product not found",400))
    }

    // allow one user to review only once.-> loop through the product's review and check if user has already reviewed.
    const AlreadyReviewed = product.reviews.find(
        (rev)=> rev.user.toString() === req.user._id.toString()
    )

    if(AlreadyReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.comment = comment
                rev.rating = rating
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    // adjust ratings
    product.ratings = product.reviews.reduce((acc,item)=> item.rating + acc,0)/product.reviews.length;

    // save
    await product.save({validateBeforeSave:false})

    // send res
    res.status(200).json({
        success:true
    })
})

exports.deleteReview = BigPromise(async(req,res,next)=>{
    const  {productId} = req.query;

    const product = await Product.findById(productId);
    if(!product){
        return next(new customError("Product not found",400))
    }

    const reviews = product.reviews.filter((rev)=>rev.user.toString() === req.user._id.toString())
    const numberOfReviews = reviews.length;
    // adjust ratings
    product.ratings = product.reviews.reduce((acc,item)=> item.rating + acc,0)/product.reviews.length;

    // update the product
    await Product.findById(productId,{
        reviews,
        ratings,
        numberOfReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    // send res
    res.status(200).json({
        success:true
    })
})

exports.getOnlyReviewsForOneProduct = BigPromise(async(req,res,next)=>{
    const  {productId} = req.query.product_id;
    const product = await Product.findById(productId);
    if(!product){
        return next(new customError("Product not found",400))
    }
    // send res
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})