import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//   return res.data
// // }
// http://localhost:3001/api/order/get-order-details/639724669c6dda4fa11edcde


// export const createOrder = async (data,access_token) => {
//   const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create/${data.user}`, data, {
//       headers: {
//           token: `Bearer ${access_token}`,
//       }
//   })
//   return res.data
// }

export const createOrder = async (data, access_token) => {
  try {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create/${data.user}`, data, {
      headers: {
        token: `Bearer ${access_token}`,
      }
    })
    // alert("thanh congi")
    return res.data; // Trả về dữ liệu nếu request thành công
  } catch (error) {
    console.log("❌Error creating order:", error);
    // Xử lý lỗi tại đây, ví dụ:
    if (error.response) {
      // Lỗi trả về từ server (status khác 2xx)
      console.log('❌ Response error:', error.response.data);
      console.log(' ❌ Response status:', error.response.status);
    } else if (error.request) {
      // Lỗi không nhận được phản hồi từ server
      console.log(' ❌Request error:', error.request);
    } else {
      // Lỗi khác, như cấu hình không hợp lệ
      console.log(' ❌Error:', error.message);
    }
    throw error; // Ném lại lỗi để có thể xử lý tiếp ở nơi gọi hàm
  }
}


export const getOrderByUserId = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getDetailsOrder = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const cancelOrder = async (id, access_token, orderItems, userId ) => {
  const data = {orderItems, orderId: id}
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}`, {data}, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const updateOrder = async (id, access_token, data) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-order/${id}`, data, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}
