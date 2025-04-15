
const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const {jwtDecode} = require('jwt-decode');
//
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GG_CLIENT_ID);
const User = require("../models/UserModel")
//
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createUserGoogle = async (req, res) => {
    const { token } = req.body;  // Lấy token từ yêu cầu frontend
    
    if (!token) {
      return res.status(400).json({ message: 'Token không hợp lệ' });
    }
    
    const decodedToken = jwtDecode(token);
    console.log('Thông tin người dùng từ Google:', decodedToken);
    try {
    //   Xác thực token với Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GG_CLIENT_ID,  // Kiểm tra xem token có phải do ứng dụng của bạn phát hành
      });
  
    //   Lấy thông tin người dùng từ token Google
      const payload = ticket.getPayload();
      const googleUserId = payload.sub;  // Google user ID
      const email = payload.email;  // Email của người dùng từ Google
      const name = payload.name;  // Tên người dùng từ Google
  
      // Kiểm tra xem người dùng đã có trong cơ sở dữ liệu chưa
      let user = await User.findOne({ googleUserId });
  
      if (!user) {
        // Nếu người dùng chưa có trong cơ sở dữ liệu, tạo mới
        user = new User({
          googleUserId,
          email,
          name,
        });
  
        await user.save();  // Lưu người dùng vào cơ sở dữ liệu
      }
  
      // Trả lại thông tin người dùng cho frontend
    //   res.status(200).json({
    //     message: 'Đăng ký thành công',
    //     user: {
    //       id: user._id,
    //       email: user.email,
    //       name: user.name,
    //     },
    //   });

    const response = await UserService.createUserGoogle(req.body)
        return res.status(200).json(response)
    } catch (error) {
      console.error('Lỗi xác thực Google token:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xác thực Google token', error: error.message });
    }
  };

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required1'
            })
        } else if (!isCheckEmail) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json({...newReponse, refresh_token})
    } catch (e) {
        console.error("❌ Error:", e);
        return res.status(404).json({
            message: e
        })
    }
}

const loginUserGoogle = async (req, res) => {
    const { token } = req.body;  // Lấy token từ yêu cầu frontend
    if (!token) {
        return res.status(400).json({ message: 'Token không hợp lệ' });
      }
    //    const decodedToken = jwtDecode(token);
    // console.log('Thông tin người dùng từ Google:', decodedToken);
    try {
        const response = await UserService.loginUserGoogle(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json({...newReponse, refresh_token})
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')

        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createUser,
    createUserGoogle,
    loginUser,
    loginUserGoogle,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany
}
