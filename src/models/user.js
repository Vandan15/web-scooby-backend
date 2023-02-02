const mongoose = require("mongoose");
const crypto = require("crypto");
// const { DataExchange } = require("aws-sdk");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is a required field"],
        },
        email: {
            type: String,
            required: [true, "Email is a required field"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is a required field"]
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            lowercase: true,
        },
        gender: {
            required: false,
            type: String
        },
        phone: {
            required: false,
            type: String
        },
        alternate_phone: {
            required: false,
            type: String
        },
        address_line1: {
            required: false,
            type: String
        },
        address_line2: {
            required: false,
            type: String
        },
        state: {
            required: false,
            type: String
        },
        city: {
            required: false,
            type: String
        },
        country: {
            required: false,
            type: String
        },
        pin: {
            required: false,
            type: String
        },
        marital_status: {
            required: false,
            type: String
        },
        employment: {
            required: false,
            type: String
        },
        sector: {
            required: false,
            type: String
        },
        resume_link: {
            required: false,
            type: String
        },
        course_purchased: [{}],
        eligible_scholarship: {
            type: Number,
            required: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
        cart: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                color: String,
                qty: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);;
