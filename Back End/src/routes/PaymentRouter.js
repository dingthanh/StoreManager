// const express = require("express");
// const router = express.Router()
// const dotenv = require('dotenv');
// dotenv.config()


// router.get('/config', (req, res) => {
//   return res.status(200).json({
//     status: 'OK',
//     data: process.env.CLIENT_ID
//   })
// })


// module.exports = router
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-payment", paymentController.createPayment);
module.exports = router;


// const express = require("express");
// const router = express.Router();
// const dotenv = require('dotenv');
// dotenv.config();

// router.get('/config', (req, res) => {
//   try {
//     const tmnCode = ' ';

//     if (!tmnCode) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'VNP_TMNCODE chưa được cấu hình trong .env'
//       });
//     }

//     return res.status(200).json({
//       status: 'OK',
//       data: tmnCode
//     });
//   } catch (error) {
//     console.error("Lỗi tại /payment/config:", error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Đã xảy ra lỗi khi lấy cấu hình VNPay'
//     });
//   }
// });

// module.exports = router;
