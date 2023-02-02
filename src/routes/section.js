const { Router } = require('express');
const { createBanners, getBanners, deleteBanners, makeActive } = require('../controllers/banner');
const { createSection, getSections, deleteSections, updateSection } = require('../controllers/section');
const { paramsValidator } = require('../middleware/paramsValidator');
const { verifyRole } = require('../middleware/verifyRole');
const { editBannerSchema } = require('./validation');
const router = Router();

router.route('/create').post(verifyRole, createSection);
router.route('/').get(getSections);
router.route('/:id').delete(verifyRole, deleteSections);
router.route('/update/:id').put(verifyRole, updateSection);

module.exports = router;
