const { VNPay, ignoreLogger } = require('vnpay');

// Hoặc import default tùy ES/require

// require('dotenv').config(); // load biến môi trường từ .env

// const config = {
//   tmnCode: process.env.VNP_TMNCODE,
//   hashSecret: process.env.VNP_HASH_SECRET,
//   returnUrl: process.env.VNP_RETURN_URL,
//   vnpUrl: process.env.VNP_URL
// };

// const vnp = new VNPay({
//     tmnCode: config.tmnCode,
//     hashSecret: config.hashSecret,
//     returnUrl: config.returnUrl,
//     vnpUrl: config.vnpUrl,
// });

// const createPaymentUrl = ({ orderId, amount }) => {
//     const url = vnp.buildPaymentUrl({
//         amount,
//         orderId,
//         orderInfo: 'Thanh toán đơn hàng #' + orderId,
//         bankCode: '',
//         locale: 'vn',
//     });

//     return url;
// };

// const handleReturnUrl = (query) => {
//     const isValid = vnp.verifyReturnUrl(query);

//     return {
//         success: isValid,
//         orderId: query.vnp_TxnRef,
//     };
// };

// const handleIpnUrl = (query) => {
//     const isValid = vnp.verifyIPN(query);

//     if (isValid) {
//         // Cập nhật DB: đơn hàng thành công
//         return 'OK';
//     }
//     return 'FAIL';
// };

// module.exports = { createPaymentUrl, handleReturnUrl, handleIpnUrl };


const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true,
  hashAlgorithm: "SHA512",
  enableLog: true,
});

exports.buildPaymentUrl = async ({
  amount,
  ipAddr,
  orderId,
  orderInfo,
  returnUrl,
  createDate,
  expireDate
}) => {
  const paymentUrl = await vnpay.buildPaymentUrl({
    vnp_Amount: amount * 100,
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: `${orderId}-${Date.now()}`,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: returnUrl,
    vnp_Locale: "vn",
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  });
  return paymentUrl;
};