const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema(
	{
		fname: {
			type: String,
			required: true
		},
		lname: {
			type: String,
			required: false
		},
		country: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: false
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Leads", leadsSchema);
