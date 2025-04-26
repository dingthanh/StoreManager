import React from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
// signup.jsx
import { signupUserGoogle } from '../../services/UserService';
import { signupUser } from '../../services/UserService';
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import jwt_decode from "jwt-decode";




const SignUpPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const user  = useSelector((state) => state.user)
  

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
  ) 
  
  const handleNavigate = () => {
    navigate('/')
  }

  const handleGetDetailsUser = async (id, token) => {
      const storage = localStorage.getItem('refresh_token')
      const refreshToken = JSON.parse(storage)
      const res = await UserService.getDetailsUser(id, token)
      dispatch(updateUser({ ...res?.data, access_token: token,refreshToken }))
    }

  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess) {
      message.success()
      if (data?.status === 'OK') {
              // ✅ Đăng nhập thành công
              localStorage.setItem('access_token', JSON.stringify(data.access_token));
              localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
              const decoded = jwt_decode(data.access_token);
              if (decoded?.id) {
                handleGetDetailsUser(decoded.id, data.access_token);
              }
              handleNavigate()
            } 
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  const handleSignUp = async () => {
    mutation.mutate({ email, password, confirmPassword })
    
  }
//   const handleSignUp = async () => {
//   try {
//         const result = await signupUser();
//         console.log('Đăng ký thành công:', result.message);
//         if(result.status === "OK"){
//           localStorage.setItem('access_token', JSON.stringify(result?.access_token))
//           localStorage.setItem('refresh_token', JSON.stringify(result?.refresh_token))
//           if (result?.access_token) {
//             const decoded = jwt_decode(result?.access_token)
//             if (decoded?.id) {
//               handleGetDetailsUser(decoded?.id, result?.access_token)
//             }
//           handleNavigate()
//         }else{
//           alert("Email không tồn tại!!!")
//         }
//       }
    

//   } catch (error) {
//     console.error('Lỗi trong quá trình đăng ký:', error);
//   }
// };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSignUp()
    }
  }

  // const handleOnSuccess = async(credentialResponse) =>{
  //   const result = await UserService.signupUserGoogle(credentialResponse.credential)
  //     try {
        
  //       if(result?.role==='user'){
  //         // dispatch(login(result));

  //         // // Gọi lấy giỏ hàng nếu cần
  //         // dispatch(fetchCart(result.id));
            
  //         // handleSignIn()
  //         // dispatch(login(result))
  //         // dispatch(fetchCart(result?.id))
  //         // mutation.mutate({
  //         //   email,
  //         //   password
  //         // })
  //       }else{
  //         alert('k dang nhap dc ')
  //       }
  //     } catch (error) {
  //       const data = error?.response?.data
  //       alert(data?.message || "dang nhap that bai")
  //     }
  //   }
  

  const handleOnSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      // Gọi signupUserGoogle để gửi token đến backend
      const result = await signupUserGoogle({ token });
      console.log('Đăng ký thành công:', result.message);
      if(result.status === "OK"){
        localStorage.setItem('access_token', JSON.stringify(result?.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(result?.refresh_token))
        if (result?.access_token) {
          const decoded = jwt_decode(result?.access_token)
          if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, result?.access_token)
          }
        handleNavigate()
      }else{
        alert("Email không tồn tại!!!")
      }
    }
      

      
      // Bạn có thể lưu thông tin hoặc thực hiện hành động sau khi đăng ký thành công
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
     
    }
  };
    const handleOnError = () =>{
      alert("dang nhap that bai")
      
    }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng kí để tạo tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="Email đăng nhập" value={email} onChange={handleOnchangeEmail} onKeyDown={handleKeyDown}/>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="Mật khẩu" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password" }
              value={password} onChange={handleOnchangePassword } onKeyDown={handleKeyDown} />
          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="Nhập lại mật khẩu" type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword} onChange={handleOnchangeConfirmPassword} onKeyDown={handleKeyDown}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: 'rgb(37, 130, 35)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Đăng ký'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
          <div>
      <GoogleLogin 
      onSuccess={handleOnSuccess}
      
      onError={handleOnError}
       />
        </div>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          {/* <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" /> */}
          <h4 style={{ color: 'white' }}>ĐĂNG KÝ</h4>
        </WrapperContainerRight>
              
       

      </div>
 
    </div >
  )
}

export default SignUpPage