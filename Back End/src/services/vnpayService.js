const { VNPay, ignoreLogger } = require('vnpay');
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
    vnp_Amount: amount ,
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