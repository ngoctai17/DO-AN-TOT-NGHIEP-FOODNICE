const express = require("express");
const { Payment, sendStripeApiKey, PaymentSheet } = require("../components/payment/controller");
const router = express.Router();


router.route("/process").post(Payment);

router.route("/stripeapikey").get(sendStripeApiKey);

router.route("/payment-sheet").post(PaymentSheet);


module.exports = router;