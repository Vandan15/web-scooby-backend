const { messages } = require("../config/messages")
const category = require("../models/category")
const { allInOne } = require("../utils/queryHelper")
const { sendSuccessResponse, sendError } = require('../utils/response')

exports.createCategory = async (req, res) => {
    try {
        let data = req.body
        const categorys = await allInOne(category, 'create', data) 
        if(!categorys) return sendError(messages.s_wrong, req, res, 400)
        return sendSuccessResponse(req, res, categorys)
    } catch(err){
        return sendError(err.message, req, res, 500)
    }
}

exports.getCategory = async (req, res) => {
    try {
        const categorys = await allInOne(category, 'find', {}) 
        return sendSuccessResponse(req, res, categorys)
    } catch(err){
        return sendError(err.message, req, res, 500)
    }
}