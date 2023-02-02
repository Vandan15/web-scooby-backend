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
const counter = require('../models/counter');

exports.createCounter = async (req, res) => {
  try {
    let data = req.body;
    const scholarship_data = await allInOne(counter, "insertMany", data);
    if (!scholarship_data) {
      return sendError(messages.s_wrong, req, res, 400);
    }
    return sendSuccessResponse(req, res, scholarship_data);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.getCounter = async (req, res) => {
  try {
    const scholarship_data = await counter.find({});
    if (!scholarship_data) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, scholarship_data);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.updateCounter = async (req, res) => {
  try {
    const { id } = req.params;
    let payload = parseObj(req.body);
    const scholarship_data = await counter.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!scholarship_data) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, scholarship_data);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}