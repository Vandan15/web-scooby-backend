const { Router } = require('express');
const { createBanners, getBanners, deleteBanners, makeActive } = require('../controllers/banner');
const { paramsValidator } = require('../middleware/paramsValidator');
const { verifyRole } = require('../middleware/verifyRole');
const { editBannerSchema } = require('./validation');
const router = Router();

router.route('/create').post(verifyRole, createBanners);
router.route('/').get(getBanners);
router.route('/:id').delete(verifyRole, deleteBanners);
router.route('/update/:id').put(verifyRole, paramsValidator(editBannerSchema, null, true) , makeActive);

module.exports = router;
