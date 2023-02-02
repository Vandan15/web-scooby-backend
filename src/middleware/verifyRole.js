const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const { sendError } = require('../utils/response')
const { messages } = require("../config/messages");
const { allInOne } = require('../utils/queryHelper');
const user = require('../models/user');

exports.verifyRole = async (req, res, next) => {
    try{
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
            console.log(token)
            if(!token) return sendError(messages.unauth_user, req, res, 400);
            jwt.verify(token, process.env.SECRET, async (err, data) => {
                if(err){
                    return sendError(messages.token_expired, req, res, 400);
                }
                if(!data) return sendError(messages.unauth_user);
                let userData = await allInOne(user, 'findOne', { _id: data.id})
                console.log(userData)
                if(!userData) return sendError(messages.u_not_exist, req, res, 400);
                if(userData.role !== 'admin')  return sendError(messages.not_permission, req, res, 401);
                req.user = userData
                next();
            });
        } else {
            return sendError(messages.unauth_user, req, res, 401);
        }
    } catch(err){
        return sendError(err.message, req, res, 500);
    }
}