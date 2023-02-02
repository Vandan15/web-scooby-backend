const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const path = require('path')
const fs = require('fs');


const { sendSuccessResponse, sendError } = require('../utils/response')
const { messages } = require('../config/messages')
const user = require('../models/user')
const courses = require('../models/courses')
const scholarships = require('../models/scholarship')
const counter = require('../models/counter')
const { allInOne } = require('../utils/queryHelper');
const { sendEmail } = require('../services/email');
const { uploadImage } = require('../services/s3');
const shortid = require("shortid");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RazorPayId,
    key_secret: process.env.RazorPaySecret,
})

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) return sendError(messages.id_required, req, res, 400)
        const isExist = await allInOne(user, 'findOne', { email: email })
        if (isExist) return sendError(messages.email_exist, req, res, 400)
        bcrypt.genSalt(12, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                let userData = await allInOne(user, 'create', { ...req.body, password: hash })
                if (!userData) return sendError(messages.s_wrong, req, res, 400)
                const token = jwt.sign({ id: userData._id }, process.env.SECRET, { expiresIn: "3d" })
                userData = Object(userData)
                userData.password = undefined;
                sendEmail(userData, null, 'Successfully Registered')
                return sendSuccessResponse(req, res, { user: userData, token })
            });
        });
    } catch (err) {
        sendError(err.message, req, res, 400)
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return sendError(messages.id_required, req, res, 400)
        let isExist = await user.findOne({ email: email }).populate('cart.item')
        if (!isExist) return sendError(messages.u_not_exist, req, res, 400)
        bcrypt.compare(password, isExist.password, async function (err, result) {
            if (err) return sendError(err, req, res, 400)
            if (!result) return sendError(messages.incorrect_pass, req, res, 400)
            const token = jwt.sign({ id: isExist._id }, process.env.SECRET, { expiresIn: "3d" })
            isExist = Object(isExist)
            isExist.password = undefined
            return sendSuccessResponse(req, res, { user: isExist, token })
        });
    } catch (err) {
        sendError(err.message, req, res, 400)
    }
}

exports.addToCart = async (req, res) => {
    const { cartItems } = req.body
    const userData = req.user
    try {
        // if(!cartItems || !cartItems.length) return sendError(messages.not_enough, req, res, 400)
        let updateCart = await user.updateOne({ _id: userData._id }, { cart: cartItems }, { new: true })
        if (!updateCart) return sendError(messages.u_not_exist, req, res, 400)
        const updatedUser = await user.findOne({ _id: userData._id }).populate('cart.item')
        return sendSuccessResponse(req, res, updatedUser)
    } catch (err) {
        sendError(err.message, req, res, 400)
    }
}

exports.addShippingAddress = async (req, res) => {
    const { addresses } = req.body
    const userData = req.user
    try {
        if (!addresses || !addresses.length) return sendError(messages.not_enough, req, res, 400)
        let updateAddress = await user.updateOne({ _id: userData._id }, { shippingAddress: addresses }, { new: true })
        if (!updateAddress) return sendError(messages.u_not_exist, req, res, 400)
        const updatedUser = await user.findOne({ _id: userData._id })
        return sendSuccessResponse(req, res, updatedUser)
    } catch (err) {
        sendError(err.message, req, res, 400)
    }
}
exports.resetPassword = async (req, res) => {
    const userData = req.user
    const { password } = req.body
    try {
        bcrypt.genSalt(12, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                let updateUser = await user.updateOne({ email: userData.email }, { password: hash }, { new: true })
                if (!updateUser) return sendError(messages.u_not_exist, req, res, 400)
                return sendSuccessResponse(req, res, { message: 'password changed' })
            });
        });

    } catch (err) {
        sendError(err.message, req, res, 400)
    }
}
exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const singleUser = await user.findOne({ email: email })
        if (!singleUser) return sendError(messages.u_not_exist, req, res, 400)
        const token = jwt.sign({ id: singleUser._id }, process.env.SECRET, { expiresIn: "3d" })
        sendEmail({ singleUser, token }, null, 'Forgot Password')
        return sendSuccessResponse(req, res, { message: `Link sent on ${email}` })

    } catch (err) {
        sendError(err.message, req, res, 400)
    }
}
exports.uploadResume = async (req, res) => {
    try {
        const { file } = req
        const userData = req.user
        if (!file) return sendError(messages.not_file, req, res, 400);
        let paths = path.join(__dirname, `../assets/uploads/${file.originalname}`)
        const fileContent = fs.readFileSync(paths);
        const fileType = file.mimetype.split('/')[1]
        if (!fileContent || !fileType) return sendError(messages.file_error, req, res, 400);
        let uploadedFile = await uploadImage(fileContent, fileType)
        // const user_data = await user.findOneAndUpdate({ email: userData.email }, { resume_link: uploadedFile }, { new: true })
        fs.unlinkSync(paths)
        if (!uploadedFile) return sendError(messages.file_error, req, res, 400);
        return sendSuccessResponse(req, res, { url: uploadedFile });
    } catch (err) {
        console.log(err)
        return sendError(err, req, res, 500);
    }
}
exports.getUsers = async (req, res) => {
    try {
        const users = await user.find({})
        return sendSuccessResponse(req, res, users);
    } catch (err) {
        console.log(err)
        return sendError(err.message, req, res, 500);
    }
};
exports.getUserCourses = async (req, res) => {
    const { id } = req.params
    try {
        const users_data = await user.findOne({ _id: id })
        if (!users_data) return sendError(messages.s_wrong, req, res, 400);
        return sendSuccessResponse(req, res, users_data.course_purchased);
    } catch (err) {
        console.log(err)
        return sendError(err.message, req, res, 500);
    }
};
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        let payload = req.body;
        const users = await user.findOneAndUpdate({ _id: id }, payload, { new: true })
        if (!users) return sendError(messages.s_wrong, req, res, 400);
        return sendSuccessResponse(req, res, users);
    } catch (err) {
        return sendError(err.message, req, res, 500);
    }
}
exports.createRazorPayOrder = async (req, res) => {
    try {
        let { id } = req.params;
        let { user_id } = req.body;
        const users_data = await user.findOne({ _id: user_id })
        const scholarship_data = await scholarships.find({});
        if (!scholarship_data) return sendError(messages.s_wrong, req, res, 400);
        const counter_data = await counter.find({});
        let current_counter = counter_data[0].order_counter;
        let scholarship_amount = scholarship_data[0].count;
        // let scholarship_amount = users_data.eligible_scholarship;
        if (!id) return sendError(messages.s_wrong, req, res, 400);
        const course = await allInOne(courses, "findOne", { _id: id });
        if (!course) return sendError(messages.s_wrong, req, res, 400);
        try {
            console.log('scholar ship amount ', scholarship_amount)
            console.log('course ', course)
            const payment_capture = 1;
            const amount = (course.actual_fees - ((course.actual_fees * scholarship_amount) / 100)) + ((course.actual_fees * 18) / 100);
            const currency = "INR";

            const options = {
                amount: amount * 100,
                currency,
                receipt: shortid.generate(),
                payment_capture,
            };
            try {
                const response = await razorpay.orders.create(options);
                console.log('razor pay create order', response);
                return sendSuccessResponse(req, res, {
                    id: response.id,
                    currency: response.currency,
                    amount: response.amount,
                    scholarship_amount
                });
            } catch (error) {
                return sendError(error, req, res, 500);
            }
        } catch (err) {
            return sendError(err.message, req, res, 500);
        }
        return sendSuccessResponse(req, res, course);
    } catch (err) {
        return sendError(err.message, req, res, 500);
    }
}
exports.validateRazorPayOrder = async (req, res) => {
    try {
        const { id } = req.params
        let payload = req.body;
        const userData = req.user
        const users_data = await user.findOne({ _id: id })
        const users = await user.findOneAndUpdate({ _id: id }, { course_purchased: [...users_data.course_purchased, ...payload.course_purchased] }, { new: true })
        if (!users) return sendError(messages.s_wrong, req, res, 400);
        const scholarship_data = await scholarships.find({});
        if (!scholarship_data) return sendError(messages.s_wrong, req, res, 400);
        const counter_data = await counter.find({});
        let current_counter = counter_data[0].order_counter;
        let scholarship_amount = scholarship_data[0].count;
        if (current_counter == 0) {
            await counter.findOneAndUpdate({ _id: '634e839d2b3ccbdac06b3167' }, { order_counter: 5 }, { new: true })
            if (scholarship_amount <= 5) {
                await scholarships.findOneAndUpdate({ _id: '6347809ae72e7454766a7220' }, { count: 20 }, { new: true })
                scholarship_amount = 20;
            } else {
                await scholarships.findOneAndUpdate({ _id: '6347809ae72e7454766a7220' }, { count: scholarship_amount - 5 }, { new: true })
                scholarship_amount = scholarship_amount - 5;
            }
        } else {
            await counter.findOneAndUpdate({ _id: '634e839d2b3ccbdac06b3167' }, { order_counter: current_counter - 1 }, { new: true })
        }
        try {
            const all_users = await user.find({})
            let admin_emails = all_users.filter(d => d.role == 'admin').map(d => d.email)
            sendEmail(users_data, payload.course_purchased, "Order Confirmed",admin_emails);
        } catch (err) {
            return sendError(err.message, req, res, 500);
        }
        return sendSuccessResponse(req, res, users);
    } catch (err) {
        return sendError(err.message, req, res, 500);
    }
}