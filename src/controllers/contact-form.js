const ContactForm = require('../models/contact-form');

exports.createForm = async (req, res) => {
  try {
    const form = await ContactForm.create(req.body);

    res.status(201).json({
      success: true,
      result: form,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

exports.getContactForm = async (req, res) => {
  try {
    const forms = await ContactForm.find();

    res.status(200).json({
      success: true,
      result: forms,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
