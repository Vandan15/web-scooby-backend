const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		category: { type: String },
		imageURL: {
			type: String,
            required: true
		},
		desktopURL: {
			type: String,
            required: true
		},
		clickedURL: {
			type: String,
			required: false
		},
		type:{
			type: String,
		},
        isActive: {
			type: Boolean,
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

module.exports = mongoose.model("Banner", bannerSchema);;
