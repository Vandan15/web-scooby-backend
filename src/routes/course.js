const { Router } = require('express');
const { createCourse, uploadCourseImage, getCourse, getCourseDetail, updateCourse, deleteCourse } = require('../controllers/courses');
const { paramsValidator } = require('../middleware/paramsValidator');
const { uploadFile } = require('../middleware/upload');
const { verifyRole } = require('../middleware/verifyRole');
const { verifyUser } = require('../middleware/verifyUser');
const { getProducts, updateProducts } = require('./validation');
const router = Router();

router.route('/create').post(verifyRole, createCourse);
router.route('/').get(getCourse);
router.route('/:id').get(getCourseDetail);
router.route('/:id').put(updateCourse);
router.route('/:id').delete(deleteCourse);
router.route('/upload').post(verifyRole, uploadFile.single("file"), uploadCourseImage);


module.exports = router;
