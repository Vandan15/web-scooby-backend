const { Router } = require('express');
const { createProduct, getProduct, getProductDetail, uploadProductImage, updateProduct, deleteProduct, searchProduct, getRelatedProduct, makeBestSeller, makeRelatedProduct, getBestSellerProduct, getNewProduct, makeNewProduct } = require('../controllers/product');
const { paramsValidator } = require('../middleware/paramsValidator');
const { uploadFile } = require('../middleware/upload');
const { verifyRole } = require('../middleware/verifyRole');
const { verifyUser } = require('../middleware/verifyUser');
const { getProducts, updateProducts } = require('./validation');
const router = Router();

router.route('/create').post(verifyRole, createProduct);
router.route('/').get(paramsValidator(getProducts, true, true), getProduct);
router.route('/related-product').get(getRelatedProduct);
router.route('/bestseller-product').get(getBestSellerProduct);
router.route('/new-product').get(getNewProduct);
router.route('/search/:search').get(searchProduct);
router.route('/:id').put(verifyRole, paramsValidator(updateProducts, null, true), updateProduct);
router.route('/:id').delete(verifyRole, deleteProduct);
router.route('/update/:id').put(verifyRole, makeBestSeller);
router.route('/update-related/:id').put(verifyRole, makeRelatedProduct);
router.route('/update-new/:id').put(verifyRole, makeNewProduct);
router.route('/:id').get(getProductDetail);
router.route('/upload').post(verifyRole, uploadFile.single("file"), uploadProductImage);

module.exports = router;
