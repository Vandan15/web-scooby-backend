const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		displayImage: {
			type: String,
			required: true
		},
		imagePos: {
			type: String,
			required: true
		},
		buttonTitle: {
			type: String,
			required: true
		},
		redirectURL: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Section", sectionSchema);;
