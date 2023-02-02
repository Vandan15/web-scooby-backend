const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
		},
		featuredImage: {
			type: String,
			required: true,
		},
		slug: {
			type: String
		},
		type:{
			type: String,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Category", categorySchema);;
