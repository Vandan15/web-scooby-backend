const Response = require('../utils/response');
const asyncWrapper = require('../utils/asyncWrapper');

class BaseController {
  constructor(service) {
    this.service = service;
    this.send = Response.send;
    this.wrapper = asyncWrapper;
  }

  findAll() {
    return this.asyncWrapper(async (req, res, next) => {
      const data = await this.service.findAll();

      this.send(res, data);
    });
  }
}

module.exports = BaseController;
