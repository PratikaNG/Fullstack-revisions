const express = require('express');
const router = express.Router();
const { testProduct,addProduct,getAllProducts,adminGetAllProducts,getSingleProduct,
    adminUpdateOneProduct,adminDeleteOneProduct,
    addReview,deleteReview,getOnlyReviewsForOneProduct } = require('../controllers/productController');
const {isLoggedIn, customRole} = require("../middlewares/userMiddleware.js");

// test route
router.route('/testProduct').get(testProduct)

// user routes
router.route('/products').get(getAllProducts)
router.route('/product/:product_id').get(getSingleProduct)
router.route('/review').put(isLoggedIn,addReview)
router.route('/review').delete(isLoggedIn,deleteReview)
router.route('/reviews').get(isLoggedIn,getOnlyReviewsForOneProduct)

// admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('admin'),addProduct)
router.route('/admin/products').get(isLoggedIn, customRole('admin'),adminGetAllProducts)
router.route('/admin/product/:product_id').put(isLoggedIn, customRole('admin'),adminUpdateOneProduct)
router.route("/admin/product/:product_id").delete(isLoggedIn,customRole('admin'),adminDeleteOneProduct); 



module.exports = router