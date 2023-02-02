const { Router } = require('express');
const { createLead, getLead, deleteLead, createRazorPayOrder,verifyPayment, updateLead, loginUser } = require('../controllers/leads');
const { uploadResume } = require('../controllers/users');
const { uploadFile } = require('../middleware/upload');
const { verifyRole } = require('../middleware/verifyRole');
const router = Router();

router.route('/create').post(createLead);
router.route('/').get(verifyRole,getLead);
router.route('/:id').delete(verifyRole,deleteLead);
router.route('/upload').post(uploadFile.single("file"), uploadResume);
router.route('/razorpay/').post(createRazorPayOrder);
router.route('/razorpay/validate/').put(verifyPayment);
router.route('/login').post(loginUser);

module.exports = router;
