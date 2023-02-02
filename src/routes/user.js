const { Router } = require('express');
const { registerUser, loginUser, addToCart, addShippingAddress, resetPassword, forgotPassword, uploadResume, getUsers, updateUser, createRazorPayOrder, validateRazorPayOrder, getUserCourses } = require('../controllers/users');
const { paramsValidator } = require('../middleware/paramsValidator');
const { uploadFile } = require('../middleware/upload');
const { verifyRole } = require('../middleware/verifyRole');
const { verifyUser } = require('../middleware/verifyUser');
const { createUser, loginUsers, cartUser, addressSchema, resetUser } = require('./validation');
const router = Router();

router.route('/create').post(registerUser);
router.route('/').get(verifyRole, getUsers);
router.route('/login').post(paramsValidator(loginUsers), loginUser);
router.route('/reset').post(verifyUser, paramsValidator(resetUser), resetPassword);
router.route('/add-to-cart').post(verifyUser, paramsValidator(cartUser), addToCart);
router.route('/add-address').post(verifyUser, paramsValidator(addressSchema), addShippingAddress);
router.route('/forgot').post(forgotPassword);
router.route('/upload').post(uploadFile.single("file"), uploadResume);
router.route('/:id').put(updateUser);
router.route('/razorpay/:id').post(createRazorPayOrder);
router.route('/razorpay/validate/:id').put(validateRazorPayOrder);
router.route('/courses/:id').get(getUserCourses);

module.exports = router;
