import React, { useEffect } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import { GoogleLogin } from '@react-oauth/google';

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user  = useSelector((state) => state.user)
  const [errorMessage, setErrorMessage] = useState('');


  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const { data, isLoading, isSuccess,isError,error} = mutation
  
  // useEffect(() => {
  //   if (isSuccess && data?.status !== 'ERR') {
  //     if(location?.state) {
  //       navigate(location?.state)
  //     }else {
  //       navigate('/')
  //     }
  //     localStorage.setItem('access_token', JSON.stringify(data?.access_token))
  //     localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
  //     if (data?.access_token) {
  //     const decoded = jwt_decode(data?.access_token)
  //     if (decoded?.id) {
  //       handleGetDetailsUser(decoded?.id, data?.access_token)
  //       }
  //     }
      
  //   }
  //   if (data?.status === 'ERR') {
  //     setErrorMessage('Kiểm tra lại email hoặc mật khẩu');
  //     console.log("123");
      
  //   }
    

  // }, [isSuccess,data] )

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === 'OK') {
        // ✅ Đăng nhập thành công
        localStorage.setItem('access_token', JSON.stringify(data.access_token));
        localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
  
        const decoded = jwt_decode(data.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, data.access_token);
        }
  
        navigate(location?.state || '/');
      } else if (data?.status === 'ERR') {
        // ❌ API trả về lỗi nhưng vẫn HTTP 200 → vẫn là isSuccess
        const errMessage = data?.message;
  
        if (errMessage === 'The input is email') {
          setErrorMessage('Email sai định dạng');
        } else if (errMessage === 'The user is not defined') {
          setErrorMessage('Email không tồn tại');
        } else if (errMessage === 'The password or user is incorrect') {
          setErrorMessage('Kiểm tra lại Email hoặc mật khẩu');
        } else {
          setErrorMessage('Lỗi không xác định');
        }
      }
    }
  
    if (isError) {
      setErrorMessage('Kiểm tra lại Email hoặc mật khẩu');
      console.log('❌ error:', error);
    }
  }, [isSuccess, isError, data, error]);
  

  const handleSignIn1 = () => {
    setErrorMessage('');
    mutation.mutate({ email, password });
  };
  



  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token,refreshToken }))
  }


 

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }
  const handleNavigate = () => {
    navigate('/')
  }

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
    
  }
  const handleOnSuccess = async (credentialResponse) => {
      try {
        const token = credentialResponse.credential;
        const result = await UserService.loginUserGoogle({ token });
        // console.log('Đăng nhap thành công:123',result.name);
        // console.log('Đăng nhap thành công:123',result.email);
        console.log('Đăng nhap thành công:123',result);
        localStorage.setItem('access_token', JSON.stringify(result?.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(result?.refresh_token))
        if (result?.access_token) {
          const decoded = jwt_decode(result?.access_token)
          if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, result?.access_token)
          }
        }
        handleNavigate()
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
          <p>Đăng nhập tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="Email đăng nhập" value={email} onChange={handleOnchangeEmail} />
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
            <InputForm
              placeholder="Mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              
              size={40}
              styleButton={{
                background: 'rgb(37, 130, 35)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
          <div>
              <GoogleLogin
              onSuccess={handleOnSuccess}
              onError={handleOnError}
                    useOneTap
                    theme="outline"
                    text="icon" // chỉ hiện mỗi icon "G"
                    shape="circle"
      />
        </div>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          {/* <Image src={{}} preview={false} alt="" height="203px" width="203px" /> */}
          <h4 style={{ color: 'white' }}>ĐĂNG NHẬP</h4>
        </WrapperContainerRight>
      </div>
      
      
    </div >

    

  )
}

export default SignInPage