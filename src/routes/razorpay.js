const { Router } = require('express');
const { createOrder, verifyPayment } = require('../controllers/razorpay');
const router = Router();
const { verifyUser } = require('../middleware/verifyUser');

router.route('/payment/create').post(verifyUser, createOrder);
router.route('/payment/verify').post(verifyUser, verifyPayment);

module.exports = router;
