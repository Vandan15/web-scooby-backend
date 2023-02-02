const ProductService = require('../services/product.service');
const BaseController = require('./base.controller');

class ProductController extends BaseController {
  findAllProducts() {
    return this.wrapper(async (req, res, next) => {
      const products = await this.service.findAllProducts();

      this.send(res, products);
    });
  }

  createProduct() {
    return this.wrapper(async (req, res, next) => {
      const { body: data } = req;
      const product = await this.service.createProduct(data);

      this.send(res, product);
    });
  }

  findProductById() {
    return this.wrapper(async (req, res, next) => {
      const { productId: id } = req.params;
      const product = await this.service.findProductById(id);

      this.send(res, product);
    });
  }

  updateProductById() {
    return this.wrapper(async (req, res, next) => {
      const { productId: id } = req.params;
      const { body: data } = req;
      const product = await this.service.updateProductById(id, data);

      this.send(res, product);
    });
  }

  deleteProductById() {
    return this.wrapper(async (req, res, next) => {
      const { productId: id } = req.params;
      const product = await this.service.deleteProductById(id);

      this.send(res, product);
    });
  }
}

module.exports = new ProductController(ProductService);
