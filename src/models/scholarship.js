const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
	{
		count: {
			type: Number,
			required: true,
			unique: false
		}

	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Scholarship", couponSchema);;
