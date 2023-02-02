const path = require('path')
const fs = require('fs');
const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();


const { messages } = require("../config/messages");
const leads = require("../models/leads");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");
const { uploadImage } = require('../services/s3');
const Razorpay = require("razorpay");
const crypto = require("crypto");
const shortid = require("shortid");
const { sendEmail } = require('../services/email');

const razorpay = new Razorpay({
  key_id: process.env.RazorPayId,
  key_secret: process.env.RazorPaySecret
})

exports.createLead = async (req, res) => {
  try {
    let data = req.body;
    const isExist = await leads.find({ email: data.email })
    console.log(isExist)
    if (isExist.length > 0) {
      return sendError(`You've already responded!`, req, res, 500);
    }
    const lead = await allInOne(leads, "insertMany", data);
    if (!lead) return sendError(messages.s_wrong, req, res, 400);
    sendEmail('CREATE_LEAD',data);
    return sendSuccessResponse(req, res, lead);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.getLead = async (req, res) => {
  try {
    const lead = await leads.find({})
    return sendSuccessResponse(req, res, lead);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};
exports.deleteLead = async (req, res) => {
  try {
    let { id } = req.params;
    const lead = await allInOne(leads, "deleteOne", { _id: id });
    if (!lead) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.uploadResume = async (req, res) => {
  try {
    const { file } = req
    if (!file) return sendError(messages.not_file, req, res, 400);
    let paths = path.join(__dirname, `../assets/uploads/${file.originalname}`)
    const fileContent = fs.readFileSync(paths);
    const fileType = file.mimetype.split('/')[1]
    if (!fileContent || !fileType) return sendError(messages.file_error, req, res, 400);
    let uploadedFile = await uploadImage(fileContent, fileType)
    fs.unlinkSync(paths)
    if (!uploadedFile) return sendError(messages.file_error, req, res, 400);
    return sendSuccessResponse(req, res, { url: uploadedFile });
  } catch (err) {
    console.log(err)
    return sendError(err, req, res, 500);
  }
}
exports.createRazorPayOrder = async (req, res) => {
  try {
    const options = {
      amount: 10000 * 100,
      currency: 'INR',
      receipt: shortid.generate(),
      payment_capture: 1,
    };
    const response = await razorpay.orders.create(options);
    console.log('razor pay create order', response);
    return sendSuccessResponse(req, res, {
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error)
    return sendError(error, req, res, 500);
  }
}
exports.verifyPayment = async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      initial_order_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const lead = await leads.findOneAndUpdate({ email: req.body.email }, req.body, { new: true })
    console.log(lead)
    if (!lead) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, {
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      lead
    });
    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
    // CALL API TO SAVE COURSE WITH SPECIFIC USER ID


  } catch (error) {
    console.log(error)
    return sendError(error, req, res, 500)
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
      if (!email || !password) return sendError(messages.id_required, req, res, 400)
      let isExist = await user.findOne({ email: email })
      if (!isExist) return sendError(messages.u_not_exist, req, res, 400)
      bcrypt.compare(password, isExist.password, async function (err, result) {
          if (err) return sendError(err, req, res, 400)
          if (!result) return sendError(messages.incorrect_pass, req, res, 400)
          const token = jwt.sign({ id: isExist._id }, process.env.SECRET, { expiresIn: "3d" })
          isExist = Object(isExist)
          isExist.password = undefined
          return sendSuccessResponse(req, res, { user: isExist, token })
      });
  } catch (err) {
      sendError(err.message, req, res, 400)
  }
}