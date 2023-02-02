const { messages } = require("../config/messages");
const banners = require("../models/banners");
const sections = require("../models/sections");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");

exports.createSection = async (req, res) => {
  try {
    let data = req.body;
    const section = await allInOne(sections, "insertMany", data.section);
    if (!section) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, section);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.deleteSections = async (req, res) => {
  try {
    let { id } = req.params;
    const section = await allInOne(sections, "deleteOne", { _id: id });
    if (!section) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params
    let payload = parseObj(req.body);
    const section = await sections.findOneAndUpdate({ _id: id }, payload.section, { new: true })
    if (!section) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, section);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}

exports.getSections = async (req, res) => {
  let payload = parseObj(req.query);
    try {
      if(payload.category){
        criteria.category = { $in: payload.category ? payload.category : [] }
      }
        const section = await allInOne(sections, 'find', null) 
        return sendSuccessResponse(req, res, section)
    } catch(err){
        return sendError(err.message, req, res, 500)
    }
}

exports.makeActive = async(req, res) => {
  const { id } = req.params
  let { isActive } = parseObj(req.body);
  try {
      if(!id) return sendError(messages.not_enough, req, res, 400)
      const banner = await banners.findOneAndUpdate({_id: id }, { isActive }, { new: true}) 
      return sendSuccessResponse(req, res, banner)
  } catch(err){
      return sendError(err.message, req, res, 500)
  }

}