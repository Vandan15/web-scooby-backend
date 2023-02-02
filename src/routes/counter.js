const { Router } = require('express');
const { createCounter, getCounter, updateCounter } = require('../controllers/counter');
const { getScholarship, updateScholarship, createScholarship } = require('../controllers/scholarship');
const { verifyRole } = require('../middleware/verifyRole');
const router = Router();

router.route('/create').post(verifyRole, createCounter);
router.route('/').get(getCounter);
// router.route('/:id').get(getCourseDetail);
router.route('/:id').put(updateCounter);
// router.route('/:id').delete(deleteCourse);
// router.route('/upload').post(verifyRole, uploadFile.single("file"), uploadCourseImage);


module.exports = router;
