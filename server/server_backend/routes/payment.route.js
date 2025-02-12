const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Định nghĩa các route cho thanh toán
router.post('/payment', paymentController.createPayment);
router.post('/callback', paymentController.callback);
router.post('/check-status-order', paymentController.checkStatusOrder);

module.exports = router;
