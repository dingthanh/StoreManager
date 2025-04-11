import axios from "axios"
import { axiosJWT } from "./UserService"

// export const getAllProduct = async (search, limit) => {
//     let res = {}
//     if (search?.length > 0) {
//         res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`)
//     } else {
//         res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`)
//     }
//     return res.data
// }
export const getAllProduct = async (search, limit) => {
    console.log("search", search);
    console.log(" search,", limit,search);
    
    try {
      let res = {};
      if (search?.length > 0) {
        res = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`
        );
        console.log(" limit12,",res.data);
        
      } else {
        res = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`
          
        );
        console.log(" limit23,", res);

      }
      return res.data;
    } catch (error) {
      console.log('❌Lỗi khi lấy danh sách sản phẩm:', error);
      return {
        status: 'ERR',
        message: 'Không thể lấy danh sách sản phẩm',
        error: error?.response?.data || error.message,
      };
    }
  };
  

export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const createProduct = async (data) => {
    console.log("data",data);
    
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
    console.log("Res",res);
    
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token,) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
    return res.data
}