const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		purchaseDate: {
			type: String,
			required: true,
			unique: false,
		},
		name: {
			type: String,
			required: true,
			unique: false,
		},
		email: {
			type: String,
			required: true,
			unique: false,
		},
		items: [
			{
				productId: {
					type: String,
					required: true,
					unique: false
				},
				imageURL: {
					type: String,
					required: true,
					unique: false
				},
				title: {
					type: String,
					required: true,
					unique: false
				},
				qty: {
					type: Number,
					required: true,
					unique: false
				},
				db_price: {
					type: Number,
					required: true,
					unique: false
				},
				salePrice: {
					type: Number,
					required: true,
					unique: false
				},
				coupon_info: {
					name: {
						type: String,
						required: false,
						unique: false
					},
					count: {
						type: Number,
						required: false,
						unique: false
					},
					expiryDate: {
						type: String,
						required: false,
						unique: false
					},
					discount: {
						type: Number,
						required: false,
						unique: false
					}
				},
				color: {
					type: String,
					required: true,
					unique: false
				}
			},
		],
		coupon_info: {
			name: {
				type: String,
				required: false,
				unique: false
			},
			count: {
				type: Number,
				required: false,
				unique: false
			},
			total_count: {
				type: Number,
				required: false,
				unique: false
			},
			expiryDate: {
				type: String,
				required: false,
				unique: false
			},
			discount: {
				type: Number,
				required: false,	
				unique: false
			},
			min_amount: {
				type: Number,
				required: false,
				unique: false
			}
		},
		deliveryStatus: {
			type: String,
			required: true,
			unique: false
		},
		address: {
			type: Object,
			required: true,
			unique: false
		},
		transactionId: {
			type: String,
			required: false,
			unique: false
		},
		orderId: {
			type: String,
			required: false,
			unique: false
		},
		paymentStatus: {
			type: String,
			required: true,
			unique: false
		},
		message: {
			type: String,
			unique: false
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", orderSchema);;
