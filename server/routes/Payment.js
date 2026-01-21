const express = require("express");
const router = express.Router();

const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail,
    webhookHandler
} = require("../controllers/Payment");

const { auth, isStudent } = require("../middleware/auth");

// ================ PAYMENT ROUTES ================

// Initiate payment (capture payment) - requires authentication as student
router.post("/capturePayment", auth, isStudent, capturePayment);

// Verify payment after Razorpay returns - requires authentication
router.post("/verifyPayment", auth, verifyPayment);

// Send payment success email - requires authentication
router.post("/sendPaymentSuccessEmail", auth, sendPaymentSuccessEmail);

// Webhook handler for Razorpay (server-to-server, no auth needed)
router.post("/webhook", webhookHandler);

module.exports = router;