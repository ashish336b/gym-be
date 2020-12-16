const router = require("express").Router();
const paypal = require("paypal-rest-sdk");
const config = require("../../config");
const serviceModel = require("../../models/serviceModel");
const { verifyClientToken } = require("../../middleware/authGuard");
const requestModel = require("../../models/RequestModel");
const paymentModel = require("../../models/paymentModel");
/**
 * method : GET
 * url : /client/payment
 * Desc : Make your payment
 */
router.post("/", verifyClientToken, async (req, res, next) => {
  let itemList = [];
  for (let i = 0; i < req.body.services.length; i++) {
    let getService = await serviceModel.findById(req.body.services[i]);
    itemList.push({
      name: getService.name,
      sku: getService.name,
      price: getService.price,
      currency: "USD",
      quantity: 1,
    });
  }
  let totalPrice = itemList.reduce((acc, curr) => {
    return acc + parseFloat(curr.price);
  }, 0);
  paypal.configure(config.paypal);
  let createPayment = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${config.baseUrl}/client/payment/successPayment?amount=${totalPrice}&requests=${req.body.request}`,
      cancel_url: `${config.baseUrl}/client/payment/cancelPayment`,
    },
    transactions: [
      {
        item_list: {
          items: itemList,
        },
        amount: {
          currency: "USD",
          total: `${totalPrice}`,
        },
        description: "This is the payment description.",
      },
    ],
  };
  paypal.payment.create(createPayment, function (error, payment) {
    if (error) {
      throw error;
    } else {
      res.json(payment.links[1].href);
    }
  });
});
/**
 * method : GET
 * url : /client/payment/cancelPayment
 */
router.get("/cancelPayment", async (req, res, next) => {
  res.json({
    error: null,
    messasge: "Error Occured in Paypal. Your payment is canceled",
  });
});
/**
 * method : GET
 * url : /client/payment/returnUrl
 */
router.get("/successPayment", async (req, res, next) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: req.query.amount,
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async (error, payment) => {
      if (error) {
        console.log(error.response);
        return res.json({ error: true, message: "Cannot execute payment" });
      } else {
        let requestIds = req.query.requests.split(",");
        for (let i = 0; i < requestIds.length; i++) {
          await requestModel.findByIdAndUpdate(requestIds[i], { isPaid: true });
          await new paymentModel({
            paymentAmount: req.query.amount,
            request: requestIds[i],
            payerId: payerId,
            paymentId: paymentId,
          }).save();
        }
        res.send("your payment is successfull.");
      }
    }
  );
});
module.exports = router;
