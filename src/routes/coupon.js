const { Router } = require('express');
const { createCoupon,updateCoupon,getCoupon } = require('../controllers/coupon');
const { createOrder, getOrder, getProductDetail, uploadProductImage, updateProduct, deleteProduct, updateOrder } = require('../controllers/order');
const { paramsValidator } = require('../middleware/paramsValidator');
const { uploadFile } = require('../middleware/upload');
const { verifyRole } = require('../middleware/verifyRole');
const { verifyUser } = require('../middleware/verifyUser');
const { getProducts, updateProducts } = require('./validation');
const router = Router();

router.route('/create').post(verifyRole, createCoupon); //create coupon
router.route('/').get(verifyUser,getCoupon); //get coupons
router.route('/:id').put(verifyUser, updateCoupon); //update coupon
// router.route('/:id').delete(verifyRole, deleteProduct);
// router.route('/:id').get(getProductDetail);
// router.route('/upload').post(verifyRole, uploadFile.single("file"), uploadProductImage);

module.exports = router;
