const { Router } = require('express');
const { getScholarship, updateScholarship, createScholarship } = require('../controllers/scholarship');
const { verifyRole } = require('../middleware/verifyRole');
const router = Router();

router.route('/create').post(verifyRole, createScholarship);
router.route('/').get(getScholarship);
// router.route('/:id').get(getCourseDetail);
router.route('/:id').put(updateScholarship);
// router.route('/:id').delete(deleteCourse);
// router.route('/upload').post(verifyRole, uploadFile.single("file"), uploadCourseImage);


module.exports = router;
