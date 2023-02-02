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
const scholarship = require('../models/scholarship');

exports.createScholarship = async (req, res) => {
  try {
    let data = req.body;
    const scholarship_data = await allInOne(scholarship, "insertMany", data);
    if (!scholarship_data) {
      return sendError(messages.s_wrong, req, res, 400);
    }
    return sendSuccessResponse(req, res, scholarship_data);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.getScholarship = async (req, res) => {
  try {
    const scholarship_data = await scholarship.find({});
    if (!scholarship_data) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, scholarship_data);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.updateScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    let payload = parseObj(req.body);
    const scholarship_data = await scholarship.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!scholarship_data) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, scholarship_data);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}