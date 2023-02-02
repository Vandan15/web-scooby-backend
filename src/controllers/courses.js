const path = require('path')
const fs = require('fs');

const { messages } = require("../config/messages");
const banners = require("../models/banners");
const product = require("../models/product");
const courses = require("../models/courses");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");
const { uploadImage } = require("../services/s3");
const { title } = require('process');

exports.createCourse = async (req, res) => {
  try {
    let data = req.body;
    const course = await allInOne(courses, "insertMany", data.userInfo);
    if (!course) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, course);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) return sendError(messages.s_wrong, req, res, 400);
    const course = await allInOne(courses, "findOne", { _id: id });
    if (!course) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, course);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.uploadCourseImage = async (req, res) => {
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
    return sendError(err, req, res, 500);
  }
}
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    let payload = parseObj(req.body.userInfo);
    const course = await courses.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!course) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, course);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}
exports.deleteCourse = async (req, res) => {
  try {
    let { id } = req.params;
    const course = await allInOne(courses, "deleteOne", { _id: id });
    if (!course) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.getCourse = async (req, res) => {
  try {
    const course = await courses.find({})
    return sendSuccessResponse(req, res, course);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};