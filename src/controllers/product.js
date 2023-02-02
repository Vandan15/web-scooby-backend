const path = require('path')
const fs = require('fs');

const { messages } = require("../config/messages");
const banners = require("../models/banners");
const product = require("../models/product");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");
const { uploadImage } = require("../services/s3");
const { title } = require('process');

exports.createProduct = async (req, res) => {
  try {
    let data = req.body;
    const products = await allInOne(product, "insertMany", data.products);
    if (!products) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) return sendError(messages.s_wrong, req, res, 400);
    const products = await allInOne(product, "findOne", { _id: id });
    if (!products) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.getProduct = async (req, res) => {
  try {
    let payload = parseObj(req.query);
    let { limit, skip, searchTerm, isBestSeller, category, subCategory, sortBy } =
      payload;
    let criteria = {};
    if (!sortBy) sortBy = 'createdAt'
    if (subCategory) criteria.subCategory = { $in: subCategory };
    if (category) criteria.category = { $in: category };
    if (isBestSeller) criteria.isBestSeller = isBestSeller;
    if (searchTerm) {
      criteria.title = {
        $regex: searchTerm,
        $options: "i",
      };
    }
    limit = limit ? limit : 30;
    skip = skip ? skip : 0;
    const banner = await banners.find({ category: { $in: category } })
    console.log(banner)
    const products = await product.aggregate([
      { $match: category && category[0] == 'home' ? {} : criteria },
      {
        $group: {
          _id: "$subCategory",
          data: { $push: "$$ROOT" },
        },
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              k: "$_id",
              v: "$data",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$data" },
        },
      },
    ]).skip(parseInt(skip)).limit(parseInt(limit)).sort({ sortBy: -1 });
    const productCount = await product.countDocuments(criteria);
    let allProds = products[0];
    if (products[0]) allProds.banners = banner ? banner : [];
    return sendSuccessResponse(req, res, products[0] ? allProds : { banners: banner }, productCount);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};
exports.getBestSellerProduct = async (req, res) => {
  try {
    const products = await product.find({ isBestSeller: true });
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};
exports.getNewProduct = async (req, res) => {
  try {
    const products = await product.find({ isNew: true });
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};
exports.getRelatedProduct = async (req, res) => {
  try {
    const products = await product.find({ isRelated: true });
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};
exports.searchProduct = async (req, res) => {
  try {
    const search = req.params.search;
    const products = await product.find({
      $or: [
        { title: { $regex: search, $options: '$i' } },
        { category: { $regex: search, $options: '$i' } },
        { subCategory: { $regex: search, $options: '$i' } }
      ]
    });
    if (!products) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    console.log(err)
    return sendError(err.message, req, res, 500);
  }
};

exports.uploadProductImage = async (req, res) => {
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    let payload = parseObj(req.body);
    const products = await product.findOneAndUpdate({ _id: id }, payload, { new: true })
    if (!products) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const banner = await allInOne(product, "deleteOne", { _id: id });
    if (!banner) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.makeBestSeller = async (req, res) => {
  const { id } = req.params
  let { isBestSeller } = parseObj(req.body);
  try {
    if (!id) return sendError(messages.not_enough, req, res, 400)
    const products = await product.findOneAndUpdate({ _id: id }, { isBestSeller }, { new: true })
    return sendSuccessResponse(req, res, products)
  } catch (err) {
    return sendError(err.message, req, res, 500)
  }

}
exports.makeNewProduct = async (req, res) => {
  const { id } = req.params
  let { isNew } = parseObj(req.body);
  try {
    if (!id) return sendError(messages.not_enough, req, res, 400)
    const products = await product.findOneAndUpdate({ _id: id }, { isNew }, { new: true })
    return sendSuccessResponse(req, res, products)
  } catch (err) {
    return sendError(err.message, req, res, 500)
  }

}
exports.makeRelatedProduct = async (req, res) => {
  const { id } = req.params
  let { isRelated } = parseObj(req.body);
  try {
    if (!id) return sendError(messages.not_enough, req, res, 400)
    const products = await product.findOneAndUpdate({ _id: id }, { isRelated }, { new: true })
    return sendSuccessResponse(req, res, products)
  } catch (err) {
    return sendError(err.message, req, res, 500)
  }

}