const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    alternatePhone: {
      type: String,
      required: false,
    },
    passport: {
      type: String,
      required: false,
    },
    qualification: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    workshop: {
      type: String,
      required: false,
    },
    membership: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactForm', contactFormSchema);
