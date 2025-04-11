import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    console.log("data,",data);
    
    // const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data)
    .then(res => res.data)
    return res
}

export const loginUserGoogle = async (data) => {
    // const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in-gg`, data)
    return res.data
    
}


export const signupUser = async (data) => {
    console.log(data);
    
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data)
    console.log(res);
    return res.data
}
export const signupUserGoogle = async (data) => {

    // const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up-gg`, data)
    // console.log('res.data,',res.data);
    // console.log("123123123");
    // return res.data
    console.log('Dữ liệu gửi lên backend:', data);
    try {
        // Gửi token đến backend
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up-gg`, data);
        alert("dang nhap that bai1 ")
        console.log("response.data",response.data);
        return response.data
      } catch (error) {
        console.error('Error during sign up', error);
      }
}
export const getDetailsUser = async (id, access_token) => {
    try {
        const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        },)
        return res.data
    } catch (error) {
        console.log('1',error);
        
        
    }
}

export const deleteUser = async (id, access_token, data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/delete-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

// export const refreshToken = async () => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
//         withCredentials: true
//     })
//     return res.data
// }

export const refreshToken = async (refreshToken) => {
    // console.log('refreshToken', refreshToken)
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {} , {
        headers: {
            token: `Bearer ${refreshToken}`,
        }
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`)
    localStorage.removeItem('access_token');
    return res.data
}

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/user/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}