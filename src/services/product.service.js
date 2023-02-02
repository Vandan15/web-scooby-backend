const Product = require('../models/product');
const BaseService = require('./base.service');

class ProductService extends BaseService {
  async findAllProducts() {
    const products = await this.findAll();

    return products;
  }

  async createProduct(data) {
    const product = await this.create(data);

    return product;
  }

  async findProductById(id) {
    const product = this.findById(id);

    return product;
  }

  async updateProductById(id, data) {
    const product = await this.updateById(id, data);

    return product;
  }

  async deleteProductById(id) {
    const product = await this.deleteById(id);
  }
}

module.exports = new ProductService(Product);
