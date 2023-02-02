const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
	{
		order_counter: {
			type: Number,
			required: true,
			unique: false
		}

	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Counter", counterSchema);;
