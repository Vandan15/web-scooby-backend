const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		count: {
			type: Number,
			required: true,
			unique: false
		},
		total_count: {
			type: Number,
			required: true,
			unique: false
		},
		expiryDate: {
			type: String,
			required: true,
			unique: false
		},
		discount: {
			type: Number,
			required: true,
			unique: false
		},
		min_amount: {
			type: Number,
			required: true,
			unique: false
		}

	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Coupon", couponSchema);;
