const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { messages } = require("../config/messages");
const banners = require("../models/banners");
const product = require("../models/product");
const order = require("../models/order");
const { parseObj } = require("../services/logical");
const { allInOne } = require("../utils/queryHelper");
const { sendSuccessResponse, sendError } = require("../utils/response");
const { uploadImage } = require("../services/s3");
const { sendEmail } = require("../services/email");
const coupon = require("../models/coupon");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const user = require("../models/user");
const { runInNewContext } = require("vm");
const razorpay = new Razorpay({
  key_id: "rzp_test_ejvTIa9rCCiPkc",
  key_secret: "24Q8aTqqXyveuAWczwwMgLm4",
});

// exports.createOrder = async (req, res) => {
//   try {
//     let data = req.body;
//     const userData = req.user
//     console.log('user-data', userData)
//     console.log('coupom', data)
//     const orders = await allInOne(order, "insertMany", data.orders);
//     if (!orders) { return sendError(messages.s_wrong, req, res, 400); }
//     else {
//       if (data.orders.coupon_info) {
//         console.log('called here', data)
//         const coupons = await coupon.findOneAndUpdate({ _id: data.orders.coupon_info._id }, { ...data.orders.coupon_info, count: data.orders.coupon_info.count - 1 }, { new: true })
//         if (!coupons) return sendError(messages.s_wrong, req, res, 400);
//       }
//       try {
//         sendEmail(userData, orders, 'Order Confirmed');
//       }
//       catch (err) {
//         return sendError(err.message, req, res, 500);
//       }
//     }
//     return sendSuccessResponse(req, res, orders);
//   } catch (err) {
//     return sendError(err.message, req, res, 500);
//   }
// };
exports.validateOrder = async (req, res, next) => {
  console.log("body from user", req.body.data);
  const { coupon_info } = req.body.data;
  let cart;
  cart = req.user.cart;
  console.log("cart", cart);
  if (!cart) {
    const error = new HttpError("Cart not found!", 500);
    return next(error);
  }
  let finalData = [];
  let total_cart_value;
  const cart_total = await cart.map(async (data, index) => {
    console.log("data", data);
    let product_info = await product.findOne({ _id: data.item });
    console.log("called eihi");
    console.log("product info", product_info);
    if (product_info.variants) {
      console.log("called here");
      product_info.variants.map((d) => {
        console.log("in map", d.color);
        console.log("in map data", data);
        if (d.color.toLowerCase() == data.color.toLowerCase()) {
          console.log("called", d);
          finalData.push({ sale_price: d.salePrice, user_qty: data.qty });
        }
      });
    }
    console.log("final data", finalData);
    total_cart_value = parseFloat(
      finalData.reduce(
        (total, data) => total + data.sale_price * data.user_qty,
        0
      )
    );
    console.log("CART VALUE", total_cart_value);
    let coupons;

    if (coupon_info && total_cart_value) {
      try {
        coupons = await coupon.findById(coupon_info._id);
        total_cart_value = total_cart_value - parseFloat(coupons.discount);
        console.log("TOTAL", total_cart_value);
        const rzpOrder = await razorpay.orders.create({
          currency: "INR",
          amount: total_cart_value * 100,
          receipt: uuidv4(),
          payment: {
            capture: "automatic",
            capture_options: {
              automatic_expiry_period: 12,
              manual_expiry_period: 7200,
              refund_speed: "optimum",
            },
          },
        });
        console.log("Checking for the razor pay order", rzpOrder);
        // if (rzpOrder) {
        //   try {
        //     // let data = req.body.data;
        //     // const userData = req.user;
        //     // console.log("user-data", userData);
        //     // console.log("coupom", data);
        //     // const orders = await allInOne(order, "insertMany", data.orders);
        //     // if (!orders) {
        //     //   return sendError(messages.s_wrong, req, res, 400);
        //     // } else {
        //     //   if (data.orders.coupon_info) {
        //     //     console.log("called here", data);
        //     //     const coupons = await coupon.findOneAndUpdate(
        //     //       { _id: data.orders.coupon_info._id },
        //     //       {
        //     //         ...data.orders.coupon_info,
        //     //         count: data.orders.coupon_info.count - 1,
        //     //       },
        //     //       { new: true }
        //     //     );
        //     //     if (!coupons) return sendError(messages.s_wrong, req, res, 400);
        //     //   }
        //     //   try {
        //     //     sendEmail(userData, orders, "Order Confirmed");
        //     //   } catch (err) {
        //     //     return sendError(err.message, req, res, 500);
        //     //   }
        //     // }
        //     // return sendSuccessResponse(req, res, orders);
        //   } catch (err) {
        //     return sendError(err.message, req, res, 500);
        //   }
        // }

        return res.status(201).json({
          isSuccess: true,
          rzpOrderId: rzpOrder,
          order: req.user.cart,
        });
      } catch (err) {
        console.log(
          "Something went wrong while looking for your order coupon!",
          err
        );
        const error = new HttpError(
          "Something went wrong while looking for your order coupon!",
          500
        );
        return next(error);
      }
    } else {
      const rzpOrder = await razorpay.orders.create({
        currency: "INR",
        amount: total_cart_value * 100,
        receipt: uuidv4(),
        payment: {
          capture: "automatic",
          capture_options: {
            automatic_expiry_period: 12,
            manual_expiry_period: 7200,
            refund_speed: "optimum",
          },
        },
      });
      // let data = req.body.data;
      // const userData = req.user;
      // console.log("user-data", userData);
      // console.log("coupom", data);
      // try {
      //   sendEmail(userData, [data.orders], "Order Confirmed");
      // } catch (err) {
      //   return sendError(err.message, req, res, 500);
      // }
      // if (rzpOrder) {
      //   try {
      //     let data = req.body.data;
      //     const userData = req.user;
      //     console.log('user-data', userData)
      //     console.log('coupom', data)
      //     const orders = await allInOne(order, "insertMany", data.orders);
      //     if (!orders) { return sendError(messages.s_wrong, req, res, 400); }
      //     else {
      //       if (data.orders.coupon_info) {
      //         console.log('called here', data)
      //         const coupons = await coupon.findOneAndUpdate({ _id: data.orders.coupon_info._id }, { ...data.orders.coupon_info, count: data.orders.coupon_info.count - 1 }, { new: true })
      //         if (!coupons) return sendError(messages.s_wrong, req, res, 400);
      //       }
      //       try {
      //         sendEmail(userData, orders, 'Order Confirmed');
      //       }
      //       catch (err) {
      //         return sendError(err.message, req, res, 500);
      //       }
      //     }
      //     return sendSuccessResponse(req, res, orders);
      //   } catch (err) {
      //     return sendError(err.message, req, res, 500);
      //   }
      // }
      console.log("Checking for the razor pay order", rzpOrder);

      return res.status(201).json({
        isSuccess: true,
        rzpOrderId: rzpOrder,
        order: req.user.cart,
      });
    }
  });

  // for (let i = 0; i < cart.cart.length; i++) {
  //   console.log('Items', cart.cart[i]);
  //   const price = +cart.cart[i].item.price * +cart.cart[i].qty;
  //   const salePrice = +cart.cart[i].item.salePrice * +cart.cart[i].qty;
  //   totalPrice += price;
  //   totalSalePrice += salePrice;
  //   if (salePrice === 0) totalSalePrice += price;
  // }

  // console.log('Checking for the price breakdown', totalPrice, totalSalePrice);

  // console.log('Checking for all the data', req.user, req.body);

  // let couponDiscount = 0;

  // if (coupon && totalSalePrice >= coupon.minPrice) {
  //   if (coupon.isPercent) {
  //     couponDiscount = Math.min((totalSalePrice * coupon.amount) / 100, coupon.maxDiscount);
  //   } else {
  //     couponDiscount = amount;
  //   }
  // }

  // console.log('Checking for the coupon', coupon);

  // const orderProductsFromCart = cart.cart.map((pro) => {
  //   return {
  //     item: pro.item._id,
  //     qty: pro.qty,
  //   };
  // });

  // const newOrder = new Order({
  //   user: req.user._id,
  //   email,
  //   phoneNumber,
  //   address,
  //   products: orderProductsFromCart,
  //   confirmed: false,
  //   cod,
  //   paid: false,
  //   confirmed: cod ? true : false,
  //   amount: totalSalePrice - couponDiscount,
  //   discount: totalPrice - totalSalePrice + couponDiscount,
  // });

  // await newOrder.save();

  // const isShipRocket = await createShipRocketOrder(newOrder);

  // console.log(isShipRocket);

  // // emailEvent.emit("sendOrderEmail", newOrder.orderId);

  // res.status(200).json({
  //   isSuccess: true,
  //   order: newOrder,
  //   couponDiscount,
  // });

  // res.json({ dbOrder });
};
exports.createOrder = async (req, res, next) => {
  console.log("body from user", req.body.data);
  const { coupon_info } = req.body.data;
  let cart;
  cart = req.user.cart;
  console.log("cart", cart);
  if (!cart) {
    const error = new HttpError("Cart not found!", 500);
    return next(error);
  }
  let finalData = [];
  let total_cart_value;
  const cart_total = await cart.map(async (data, index) => {
    console.log("data", data);
    let product_info = await product.findOne({ _id: data.item });
    console.log("called eihi");
    console.log("product info", product_info);
    if (product_info.variants) {
      console.log("called here");
      product_info.variants.map((d) => {
        console.log("in map", d.color);
        console.log("in map data", data);
        if (d.color.toLowerCase() == data.color.toLowerCase()) {
          console.log("called", d);
          finalData.push({ sale_price: d.salePrice, user_qty: data.qty });
        }
      });
    }
    console.log("final data", finalData);
    total_cart_value = parseFloat(
      finalData.reduce(
        (total, data) => total + data.sale_price * data.user_qty,
        0
      )
    );
    console.log("CART VALUE", total_cart_value);
    let coupons;

    if (coupon_info && total_cart_value) {
      try {
        try {
          let data = req.body.data;
          const userData = req.user;
          console.log("user-data", userData);
          console.log("coupom", data);
          const orders = await allInOne(order, "insertMany", data.orders);
          if (!orders) {
            return sendError(messages.s_wrong, req, res, 400);
          } else {
            if (data.orders.coupon_info) {
              console.log("called here", data);
              const coupons = await coupon.findOneAndUpdate(
                { _id: data.orders.coupon_info._id },
                {
                  ...data.orders.coupon_info,
                  count: data.orders.coupon_info.count - 1,
                },
                { new: true }
              );
              if (!coupons) return sendError(messages.s_wrong, req, res, 400);
            }
            try {
              sendEmail(userData, orders, "Order Confirmed");
            } catch (err) {
              return sendError(err.message, req, res, 500);
            }
          }
          // return sendSuccessResponse(req, res, orders);
        } catch (err) {
          return sendError(err.message, req, res, 500);
        }

        return res.status(201).json({
          isSuccess: true,
        });
      } catch (err) {
        console.log(
          "Something went wrong while looking for your order coupon!",
          err
        );
        const error = new HttpError(
          "Something went wrong while looking for your order coupon!",
          500
        );
        return next(error);
      }
    } else {
      
      let data = req.body.data;
      const userData = req.user;
      const orders = await allInOne(order, "insertMany", data.orders);
      try {
        sendEmail(userData, [data.orders], "Order Confirmed");
      } catch (err) {
        return sendError(err.message, req, res, 500);
      }
      return res.status(201).json({
        isSuccess: true,
      });
    }
  });

  // for (let i = 0; i < cart.cart.length; i++) {
  //   console.log('Items', cart.cart[i]);
  //   const price = +cart.cart[i].item.price * +cart.cart[i].qty;
  //   const salePrice = +cart.cart[i].item.salePrice * +cart.cart[i].qty;
  //   totalPrice += price;
  //   totalSalePrice += salePrice;
  //   if (salePrice === 0) totalSalePrice += price;
  // }

  // console.log('Checking for the price breakdown', totalPrice, totalSalePrice);

  // console.log('Checking for all the data', req.user, req.body);

  // let couponDiscount = 0;

  // if (coupon && totalSalePrice >= coupon.minPrice) {
  //   if (coupon.isPercent) {
  //     couponDiscount = Math.min((totalSalePrice * coupon.amount) / 100, coupon.maxDiscount);
  //   } else {
  //     couponDiscount = amount;
  //   }
  // }

  // console.log('Checking for the coupon', coupon);

  // const orderProductsFromCart = cart.cart.map((pro) => {
  //   return {
  //     item: pro.item._id,
  //     qty: pro.qty,
  //   };
  // });

  // const newOrder = new Order({
  //   user: req.user._id,
  //   email,
  //   phoneNumber,
  //   address,
  //   products: orderProductsFromCart,
  //   confirmed: false,
  //   cod,
  //   paid: false,
  //   confirmed: cod ? true : false,
  //   amount: totalSalePrice - couponDiscount,
  //   discount: totalPrice - totalSalePrice + couponDiscount,
  // });

  // await newOrder.save();

  // const isShipRocket = await createShipRocketOrder(newOrder);

  // console.log(isShipRocket);

  // // emailEvent.emit("sendOrderEmail", newOrder.orderId);

  // res.status(200).json({
  //   isSuccess: true,
  //   order: newOrder,
  //   couponDiscount,
  // });

  // res.json({ dbOrder });
};
exports.getProductDetail = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) return sendError(messages.s_wrong, req, res, 400);
    const products = await allInOne(product, "findOne", { _id: id });
    if (!products) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, products);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { email } = req.body;
    let orders;
    if (!email) orders = await order.find({});
    else orders = await order.find({ email });
    const orderCount = await order.countDocuments();
    let allProds = orders;
    return sendSuccessResponse(req, res, allProds, orderCount);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return sendError(messages.not_file, req, res, 400);
    let paths = path.join(__dirname, `../assets/uploads/${file.originalname}`);
    const fileContent = fs.readFileSync(paths);
    const fileType = file.mimetype.split("/")[1];
    if (!fileContent || !fileType)
      return sendError(messages.file_error, req, res, 400);
    let uploadedFile = await uploadImage(fileContent, fileType);
    fs.unlinkSync(paths);
    if (!uploadedFile) return sendError(messages.file_error, req, res, 400);
    return sendSuccessResponse(req, res, { url: uploadedFile });
  } catch (err) {
    return sendError(err, req, res, 500);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let payload = parseObj(req.body);
    const userData = req.user;
    const orders = await order.findOneAndUpdate({ orderId: id }, payload, {
      new: true,
    });
    if (!orders) return sendError(messages.s_wrong, req, res, 400);
    else {
      try {
        sendEmail(userData, orders, payload.message);
      } catch (err) {
        return sendError(err.message, req, res, 500);
      }
    }
    return sendSuccessResponse(req, res, orders);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
exports.initRazorPay = async (req, res) => {
  const payment_capture = 1;
  const amount = req.body.amount;
  const currency = "INR";
  const options = {
    amount: amount,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    return sendSuccessResponse(req, res, {
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      payment: {
        capture: "automatic",
        capture_options: {
          automatic_expiry_period: 12,
          manual_expiry_period: 7200,
          refund_speed: "optimum",
        },
      },
    });
  } catch (error) {
    console.log(error);
    return sendError(error.message, req, res, 500);
  }
};
exports.verifyRazorPay = async (req, res) => {
  const secret = "12345678";

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    require("fs").writeFileSync(
      "payment1.json",
      JSON.stringify(req.body, null, 4)
    );
  } else {
    // pass it
  }
  res.json({ status: "ok" });
};
exports.deleteProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const banner = await allInOne(product, "deleteOne", { _id: id });
    if (!banner) return sendError(messages.s_wrong, req, res, 400);
    return sendSuccessResponse(req, res, messages.success);
  } catch (err) {
    return sendError(err.message, req, res, 500);
  }
};
