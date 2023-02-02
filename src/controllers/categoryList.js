const { messages } = require("../config/messages");
const banners = require("../models/banners");
const categoryList = require("../models/categoryList");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");

exports.createCategory = async (req, res) => {
  try {
    let data = req.body;
    const category = await allInOne(categoryList, "insertMany", data.categoryList);
    if (!category) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, category);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    let payload = parseObj(req.body);
    const category = await categoryList.findOneAndUpdate({ _id: id }, payload.categoryList, { new: true })
    if (!category) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, category);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    let { id } = req.params;
    const category = await allInOne(categoryList, "deleteOne", { _id: id });
    if (!category) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.getCategoryList = async (req, res) => {
  let payload = parseObj(req.query);
  try {
    if (payload.category) {
      criteria.category = { $in: payload.category ? payload.category : [] }
    }
    const category = await allInOne(categoryList, 'find', null)
    return sendSuccessResponse(req, res, category)
  } catch (err) {
    return sendError(err.message, req, res, 500)
  }
}

exports.makeActive = async (req, res) => {
  const { id } = req.params
  let { isActive } = parseObj(req.body);
  try {
    if (!id) return sendError(messages.not_enough, req, res, 400)
    const category = await categoryList.findOneAndUpdate({ _id: id }, { isActive }, { new: true })
    return sendSuccessResponse(req, res, category)
  } catch (err) {
    return sendError(err.message, req, res, 500)
  }

}