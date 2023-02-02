const { parseObj } = require('../services/logical');
const { sendError } = require('../utils/response')


exports.paramsValidator = (schema, isGet, isParse) => async (req, res, next) => {
    try {
        const data =  isGet ? req.query : req.body;
        const { error } = schema.validate(isParse ? parseObj(data) : data);
        if (error) {
            return sendError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, req, res, 400);
        } else {
            next();
        }
    } catch (err) {
        return sendError(err.message, req, res, 400);
    }
}