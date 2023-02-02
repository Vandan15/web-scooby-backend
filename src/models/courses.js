const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		tagline: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		duration: {
			type: String,
			required: true
		},
		actual_fees: {
			type: String,
			required: true
		},
		sale_fees: {
			type: String,
			required: true
		},
		overview: {
			type: String,
			required: true
		},
		curriculam: [
			{
				name: { type: String },
				description: { type: String }
			}
		],
		evaluation: {
			type: String,
			required: true
		},
		who_can_apply: {
			type: String,
			required: true
		},
		benefits: {
			type: String,
			required: true
		},
		certificate: {
			type: String,
			required: true
		},
		admission_procedure: {
			type: String,
			required: true
		},
		faculties: [
			{
				name: { type: String },
				img_url: { type: String },
				description: { type: String },
				resume_link: { type: String }
			}
		],
		video_url: {
			type: String,
			required: false
		},
		thumbnail_img: {
			type: String,
			required: true
		},
		isBest: {
			type: Boolean,
			required: false
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Courses", coursesSchema);
