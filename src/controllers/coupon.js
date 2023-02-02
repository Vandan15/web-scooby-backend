const path = require('path')
const fs = require('fs');

const { messages } = require("../config/messages");
const banners = require("../models/banners");
const product = require("../models/product");
const order = require("../models/order");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");
const { uploadImage } = require("../services/s3");
const { sendEmail } = require('../services/email');
const coupon = require('../models/coupon');

exports.createCoupon = async (req, res) => {
  try {
    let data = req.body;
    const coupons = await allInOne(coupon, "insertMany", data);
    if (!coupons) {
      return sendError(messages.s_wrong, req, res, 400);
    }
    return sendSuccessResponse(req, res, coupons);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.getCoupon = async (req, res) => {
  try {
    const coupons = await coupon.find({});
    if(!coupons) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, coupons);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    let payload = parseObj(req.body);
    const coupons = await coupon.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!coupons) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, coupons);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}