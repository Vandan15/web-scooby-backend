const { Router } = require('express');

const Controller = require('../controllers/contact-form');

const router = Router();

router.post('/create', Controller.createForm);
router.get('/get', Controller.getContactForm);

module.exports = router;
