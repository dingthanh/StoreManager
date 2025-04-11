// import axios from "axios"

// export const getConfig = async () => {
//   const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`)
//   return res.data
// }

import axios from "axios";

export const createVNPayPayment = async (paymentData) => {
  try {
    console.log('paymentData',paymentData);
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment/create-payment`, paymentData);

    console.log('paymentData1',response);
    return response;
  } catch (error) {
    console.error("Loi goi API thanh toan VNPay:", error);
    throw error;
  }
};

