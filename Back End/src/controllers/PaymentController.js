// import { VNPay, ignoreLogger } from 'vnpay';

// const vnpay = new VNPay({
//     // Thông tin cấu hình bắt buộc
//     tmnCode: '4E4U4LGL',
//     secureSecret: 'T8JW44Y7GHPTNLELD0WLBKWP8CTPOO4E',
//     vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    
//     // Cấu hình tùy chọn
//     testMode: true,                // Chế độ test
//     hashAlgorithm: 'SHA512',      // Thuật toán mã hóa
//     enableLog: true,              // Bật/tắt ghi log
//     loggerFn: ignoreLogger,       // Hàm xử lý log tùy chỉnh
    
//     // Tùy chỉnh endpoints cho từng phương thức API (mới)
//     // Hữu ích khi VNPay thay đổi endpoints trong tương lai
//     endpoints: {
//         paymentEndpoint: 'paymentv2/vpcpay.html',          // Endpoint thanh toán
//         queryDrRefundEndpoint: 'merchant_webapi/api/transaction', // Endpoint tra cứu & hoàn tiền
//         getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list', // Endpoint lấy danh sách ngân hàng
//     }
// });



// // const tomorrow = new Date();
// // tomorrow.setDate(tomorrow.getDate()+1)
// // const vnpayResponse = await vnpay.buildPaymentUrl({
// //     vnp_Amount: findCart.total,
// //     vnp_IpAddr: '127.0.0.1',
// //     vnp_TxnRef: findCart._id,
// //     vnp_OrderInfo: `${findCart._id}`,
// //     vnp_OrderType: 'other',
// //     vnp_ReturnUrl: 'http://localhost:5001/api/check-payment-vnpay',
// //     vnp_Locale: 'vn',
// //     vnp_CreateDate: dateFormat(new Date()),
// //     vnp_ExpireDate: dateFormat(tomorrow)
// //   });
// //   console.log("vnpayResponse",vnpayResponse)
// //   return res.status(201).json(vnpayResponse);


// try {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
  
//     const vnpayResponse = await vnpay.buildPaymentUrl({
//       vnp_Amount: findCart.total,
//       vnp_IpAddr: '127.0.0.1',
//       vnp_TxnRef: findCart._id,
//       vnp_OrderInfo: `${findCart._id}`,
//       vnp_OrderType: 'other',
//       vnp_ReturnUrl: 'http://localhost:5001/api/check-payment-vnpay',
//       vnp_Locale: 'vn',
//       vnp_CreateDate: dateFormat(new Date()),
//       vnp_ExpireDate: dateFormat(tomorrow),
//     });
  
//     console.log("vnpayResponse", vnpayResponse);
  
//     return res.status(201).json(vnpayResponse);
//   } catch (error) {
//     console.log("Lỗi khi tạo VNPay URL:", error);
//     return res.status(500).json({
//       status: "error",
//       message: "Không thể tạo URL thanh toán VNPay",
//       detail: error.message || error,
//     });
//   }
  


//   async function checkPayment(req, res) {
//     const { vnp_responseCode, vnp_OrderInfo } = req.query;
//     if(vnp_responseCode==="00"){
//     const idCart = vnp_OrderInfo
//     const findCart = await modelCart.findOne({ _id: idCart });
//     const newPayment = new ModelPayments({
//         userId: findCart.userId,
//         products: findCart.products,
//         address: findCart.address,
//         phone: findCart.phone,
//         status: true,
//         typePayments: 'VNPay',
//     });

//     await newPayment.save();
//     await findCart.deleteOne();
//     return res.redirect(`${process.env.DOMAIN_URL}/checkout/${newPayment._id}`);
//     }
// }



// const VNPayService = require('../services/vnpayService');
// const getConfig = (req, res) => {
//   res.json({
//     tmnCode: process.env.VNP_TMNCODE,
//     vnpUrl: process.env.VNP_URL,
//     returnUrl: process.env.VNP_RETURN_URL
//   });
// };

// const createPayment = async (req, res) => {
//     const {orderId, amount } = req.body;

//     const paymentUrl = await VNPayService.createPaymentUrl({ orderId, amount });

//     return res.json({ url: paymentUrl }); // trả URL để frontend redirect sang VNPay
// };

// const vnpayReturn = async (req, res) => {
//     const result = await VNPayService.handleReturnUrl(req.query);

//     if (result.success) {
//         // thanh toán thành công -> xử lý tiếp
//         return res.redirect(`/success?orderId=${result.orderId}`);
//     } else {
//         return res.redirect('/fail');
//     }
// };

// const vnpayIpn = async (req, res) => {
//     const result = await VNPayService.handleIpnUrl(req.query);
//     res.status(200).send(result); // VNPay yêu cầu trả đúng status 200
// };

// module.exports = { createPayment, vnpayReturn, vnpayIpn,getConfig };


const vnpayService = require("../services/vnpayService");
const dateFormat = require("dateformat");


function formatDateVNPay(date) {
  const pad = (n) => n < 10 ? '0' + n : n;
  return date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds());
}


exports.createPayment = async (req, res) => {
  try {
    const { amount, orderId, userId, orderInfo, returnUrl } = req.body;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = await vnpayService.buildPaymentUrl({
      amount,
      ipAddr: req.ip || "127.0.0.1",
      orderId,
      orderInfo,
      returnUrl,
      createDate: formatDateVNPay(new Date(), "yyyymmddHHMMss"),
      expireDate: formatDateVNPay(tomorrow, "yyyymmddHHMMss")
    });

    return res.status(200).json({
      status: "success",
      paymentUrl
    });
  } catch (error) {
    console.error("Loi khi tao payment URL:", error);
    return res.status(500).json({
      status: "error",
      message: "Khong tao duoc URL thanh toan"
    });
  }
};