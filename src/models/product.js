const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    imageUrl: String,
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    variants: [
      {
        displayImage: String,
        thumbnailImages: [String],
        color: String,
        sku: String,
        price: Number,
        salePrice: Number,
        totalStock: Number,
        inStock: Boolean,
        qty: Number,
        description: String
      },
    ],
    inStock: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isRelated: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: false
    },
    product_description: {
      logo: String,
      banner_images: [String],
      core_description: [Object],
      required: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

module.exports = model('Product', productSchema);
