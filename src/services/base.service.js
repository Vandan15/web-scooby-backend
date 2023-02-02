class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return await this.model.find().lean().exec();
  }

  async findById(id) {
    return await this.model.findById(id).lean().exec();
  }

  async create(data) {
    return await this.model.create(data);
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseService;
