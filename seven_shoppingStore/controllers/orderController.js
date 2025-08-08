const Order = require("../models/order");
const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise")
const customError = require("../utils/customError")

exports.createOrder = BigPromise(async(req,res,next)=>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount
    } = req.body;

    const order = await Order.create({shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
    })

    // send res
    res.status(200).json({
       success: true,
       order
    })
})

exports.getOneOrder = BigPromise(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate(
        'user', //field in response to be expanded
        'name email' //the data to be displayed from that field
    );

    if(!order){
        return next(new customError("Please check order id.",401))
    }

    // send res
    res.status(200).json({
       success: true,
       order
    })
})

exports.getLoggedInOrders = BigPromise(async(req,res,next)=>{

    const order = await Order.find({user: req.user._id});

    if(!order){
        return next(new customError("Please check order id.",401))
    }

    // send res
    res.status(200).json({
       success: true,
       order
    })
})

exports.adminGetAllOrders = BigPromise(async(req,res,next)=>{
    const orders = await Order.find();

    if(!orders){
        return next(new customError("No irders found.",401))
    }

    // send res
    res.status(200).json({
       success: true,
       orders
    })
})

exports.adminUpdateOrder = BigPromise(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new customError("Order not found.",401))
    }

    if(order.orderStatus === 'Delivered'){
        return next(new customError("Order is already delivered",401))
    }
    order.orderStatus = req.body.orderStatus;
    order.orderItems.forEach(async(prod)=>{
       await updateProductStock(prod.product, prod.quantity)
    })
    await order.save();

    // send res
    res.status(200).json({
       success: true,
       order
    })
})

async function updateProductStock(productId,quantity){
    const product = await Order.findById(productId);

    if(!product){
        return next(new customError("No product found.",401))
    }

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave: false});
}

exports.deleteOrder = BigPromise(async(req,res,next)=>{
    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order){
        return next(new customError("Order not found.",401))
    }

    res.status(200).json({
        success: true,
        message: 'Product deleted.'
    })
})




// Error solution
// CastError: Cast to ObjectId failed for value &quot;myOrder&quot; 
// This error happens when there are 2 routes like below-> it will take "myOrder" in second route as :id in first.
    // router.route("/order/:id").get(isLoggedIn,getOneOrder)
    // router.route("/order/myOrder").get(isLoggedIn,getLoggedInOrders)
// to resolve this make the second route as
    // router.route("/myOrder").get(isLoggedIn,getLoggedInOrders)