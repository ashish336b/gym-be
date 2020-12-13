const router = require("express").Router();
const paypal = require("paypal-rest-sdk");
/**
 * method : GET
 * url : /client/payment
 * Desc : Make your payment
 */
router.get("/", async (req, res, next) => {
  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AVXxWZaYTznAA4bFDUjZBolgt_G_j2JN6DRYkp5xCpXLXAnsGl_YSWEp1aG52RiP_VmebIQTyYHqBtDR",
    client_secret:
      "ED_OMQI3hnGNeGGgKyRTAOMreL-Q6-QisAALUSMSlH059sO1LO02tUvmn-nQhoXFsJE0M4vfkJTJdAqk",
  });
  let createPayment = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/client/payment/successPayment",
      cancel_url: "http://localhost:3000/client/payment/cancelPayment",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: "10.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "10.00",
        },
        description: "This is the payment description.",
      },
    ],
  };
  paypal.payment.create(createPayment, function (error, payment) {
    if (error) {
      throw error;
    } else {
      res.json(payment);
    }
  });
});
/**
 * method : GET
 * url : /client/payment/cancelPayment
 */
router.get("/cancelPayment", async (req, res, next) => {
  res.json({ error: null, messasge: "cancel payment" });
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
          total: "10.00",
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        res.send("your payment is successfull.");
      }
    }
  );
});
module.exports = router;
