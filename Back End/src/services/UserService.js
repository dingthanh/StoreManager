const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const {jwtDecode} = require('jwt-decode');
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone, username } = newUser;

        try {
            // Kiểm tra username
            const usernameRegex = /^[a-z0-9_]{1,20}$/; // không chữ hoa, không ký tự đặc biệt, tối đa 20 ký tự
            if (!usernameRegex.test(username)) {
                return resolve({
                    status: 'ERR',
                    message: 'Tên đăng nhập không hợp lệ.'
                });
            }

            // Kiểm tra email đã được dùng chưa
            const checkUser = await User.findOne({ email });
            if (checkUser !== null) {
                return resolve({
                    status: 'ERR',
                    message: 'Email đã được sử dụng.'
                });
            }

            // Hash password
            const hash = bcrypt.hashSync(password, 10);

            // Tạo user
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
                username
            });
            const access_token = await genneralAccessToken({
                id: createdUser.id,
                isAdmin: createdUser.isAdmin
              });
              
              const refresh_token = await genneralRefreshToken({
                id: createdUser.id,
                isAdmin: createdUser.isAdmin
              });

            if (createdUser) {
                // await EmailService.sendEmailCreateOrder(email,orderItems)  
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser,
                    id: createdUser.id,
                    access_token,
                    refresh_token,
                });
            }
        } catch (e) {
           console.log(e);
           
        }
    });
};




 
// const createUserGoogle =async (req, res)=>{
//     const token = req.body;

//     const payload = await verifyToken(token);
//     const { name, sub } = payload;

//     const account = await accountModel.findOne({ email, googleId: sub });
//     if(!account){
//      account = await accountModel.create({
//         name: name,
//         username: email,
//         email: email,
//         is_active: true,
//         googleId: sub,
//     })};

//     return res.status(200).json(account);
// }

const createUserGoogle = (newGoogleUser) => {

    const decodedToken = jwtDecode(newGoogleUser.token);
        console.log('Thông tin người dùng từ Google:', decodedToken);
    return new Promise(async (resolve, reject) => {
      const { sub, email, name } = decodedToken;
      console.log(decodedToken.sub);
      console.log(decodedToken.email);
      console.log('1',decodedToken.name);


  
      try {
        // Kiểm tra xem người dùng đã có trong cơ sở dữ liệu chưa
        const checkUser = await User.findOne({
            // sub: sub,  // Kiểm tra theo Google User ID
            email: email
        });
        // console.log(checkUser.googleUserId);
       
        if (checkUser !== null) {
            const access_token = await genneralAccessToken({
              id: checkUser.id,
              isAdmin: checkUser.isAdmin
            });
          
            const refresh_token = await genneralRefreshToken({
              id: checkUser.id,
              isAdmin: checkUser.isAdmin
            });
          
            resolve({
              status: 'OK',
              message: 'Đăng nhập thành công',
              data: checkUser,
              id: checkUser.id,
              access_token,
              refresh_token,
              name: checkUser.name,
              email: checkUser.email
            });
            return;
          }
          
          // Nếu chưa có, tạo người dùng mới
          const createdUser = await User.create({ sub, email, name });
          
          const access_token = await genneralAccessToken({
            id: createdUser.id,
            isAdmin: createdUser.isAdmin
          });
          
          const refresh_token = await genneralRefreshToken({
            id: createdUser.id,
            isAdmin: createdUser.isAdmin
          });
          
          resolve({
            status: 'OK',
            message: 'Đăng ký thành công',
            data: createdUser,
            id: createdUser.id,
            access_token,
            refresh_token,
            name,
            email
          });
      } catch (e) {
        console.log(e);
        
        reject(e);  // Nếu có lỗi, reject Promise
      }
    });
  };

const loginUserGoogle = (newGoogleUser) => {

    const decodedToken = jwtDecode(newGoogleUser.token);
        console.log('Thông tin người dùng từ Google:', decodedToken);
    return new Promise(async (resolve, reject) => {
      const { sub, email, name } = decodedToken;
      console.log(decodedToken.sub);
      console.log(decodedToken.email);
      console.log('1',decodedToken.name);

      try {
        // Kiểm tra xem người dùng đã có trong cơ sở dữ liệu chưa
        const checkUser = await User.findOne({
            // sub: sub,  // Kiểm tra theo Google User ID
            email: email
            
        });
        console.log(email);
        
        
        console.log(checkUser);
        if (email === null) {
          resolve({
            status: 'ERR',
            message: 'The user is not defined ben login gg',
          });// Ngừng hàm nếu người dùng đã có
        }
        
        const access_token = await genneralAccessToken({
            id: checkUser.id,
            isAdmin: checkUser.isAdmin
        })

        const refresh_token = await genneralRefreshToken({
            id: checkUser.id,
            isAdmin: checkUser.isAdmin
        })

        resolve({
            status: 'OK',
            message: 'SUCCESS',
            id: checkUser.id,
            access_token,
            refresh_token,
            name,
            email
        })
        
        
      } catch (e) {
        reject(e);  // Nếu có lỗi, reject Promise
      }
    });
  };

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const {name,email,password,confirmPassword,phone}=userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            console.log(password,checkUser.password);
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                id: checkUser.id,
                access_token,
                refresh_token
            })
        } catch (e) {
            console.error("❌ Error:", e);
            
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
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
    deleteManyUser
}