const { messages } = require("../config/messages");
const banners = require("../models/banners");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");

exports.createBanners = async (req, res) => {
  try {
    let data = req.body;
    const banner = await allInOne(banners, "insertMany", data.banner);
    if (!banner) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, banner);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.deleteBanners = async (req, res) => {
  try {
    let { id } = req.params;
    const banner = await allInOne(banners, "deleteOne", { _id: id });
    if (!banner) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.getBanners = async (req, res) => {
  let payload = parseObj(req.query);
    try {
      if(payload.category){
        criteria.category = { $in: payload.category ? payload.category : [] }
      }
        const banner = await allInOne(banners, 'find', null) 
        return sendSuccessResponse(req, res, banner)
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