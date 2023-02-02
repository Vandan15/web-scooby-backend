const path = require('path')
const fs = require('fs');

const { messages } = require("../config/messages");
const banners = require("../models/banners");
const product = require("../models/product");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");
const { uploadImage } = require("../services/s3");
const shortid = require("shortid");
const { title } = require('process');
const crypto = require("crypto");

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: "rzp_test_ejvTIa9rCCiPkc",
    key_secret: "24Q8aTqqXyveuAWczwwMgLm4",
});

exports.createOrder = async (req, res) => {
    const payment_capture = 1;
    const amount = req.body.amount; //get from course table using id
    const currency = "INR";
    const options = {
        amount: amount,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        return sendSuccessResponse(req, res, {
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            payment: {
                capture: "automatic",
                capture_options: {
                    automatic_expiry_period: 12,
                    manual_expiry_period: 7200,
                    refund_speed: "optimum",
                },
            },
        });
    } catch (error) {
        console.log(error);
        return sendError(error.message, req, res, 500);
    }
};
exports.verifyPayment = async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
             return sendError('Transaction not legit!', req, res, 400)

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        // CALL API TO SAVE COURSE WITH SPECIFIC USER ID

        return sendSuccessResponse(req, res, {
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        return sendError(error, req, res, 500)
    }
};