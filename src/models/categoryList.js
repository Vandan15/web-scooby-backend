const mongoose = require("mongoose");

const categoryListSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: false
		},
		sub_category: {
			type: String,
			required: true,
			unique: true
		},
		displayList: [
			{
				thumbnails:String,
				title:String
			}
		],
		isActive: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("CategoryList", categoryListSchema);;
