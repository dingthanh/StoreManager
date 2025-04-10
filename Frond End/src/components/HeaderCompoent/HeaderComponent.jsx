import { Badge, Button, Col, Popover } from 'antd'
import React from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButttonInputSearch from '../ButtonInputSearch/ButttonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { useEffect } from 'react';
import { searchProduct } from '../../redux/slides/productSlide';


const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search,setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (

        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-user')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{  heiht: '100%', width: '100%', display: 'flex',background: '#739072', justifyContent: 'center' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' , background: '#739072'}}>
        <Col span={5}>
          <WrapperTextHeader to='/'> thanh</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <ButttonInputSearch
              size="large"
              bordered={false}
              textbutton="Tìm kiếm"
              placeholder="Tìm kiếm"
              onChange={onSearch}
              backgroundColorButton="#3A4D39"
            />
          </Col>
        )}
        <Col span={6} style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Loading isLoading={loading}>
          <WrapperHeaderAccout>
  {user?.access_token ? (
    <Popover content={content} trigger="click" open={isOpenPopup}>
      <div
        style={{
          cursor: 'pointer',
          padding: '8px 16px',
          backgroundColor: 'rgb(115, 144, 114)',
          borderRadius: '999px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '500',
          fontSize: '12px',
          transition: '0.3s',
          userSelect: 'none',
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgb(115, 144, 114)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1890ff';
          e.currentTarget.style.color = 'white';
        }}
        onClick={() => setIsOpenPopup((prev) => !prev)}
      >
        <UserOutlined style={{ fontSize: '20px' }} />
        {userName?.length ? userName : user?.email}
      </div>
    </Popover>
  ) : (
    <div
      onClick={handleNavigateLogin}
      style={{
        cursor: 'pointer',
        padding: '8px 16px',
        backgroundColor: 'rgb(115, 144, 114)',
        borderRadius: '999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        fontSize: '12px',
        transition: '0.3s',
        userSelect: 'none',
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgb(115, 144, 114)';
        e.currentTarget.style.color = 'white';
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1890ff';
        e.currentTarget.style.color = 'rgb(115, 144, 114)';
      }}
    >
      <UserOutlined style={{ fontSize: '20px' }} />
      <WrapperTextHeaderSmall>Đăng nhập</WrapperTextHeaderSmall>
    </div>
  )}
</WrapperHeaderAccout>

          </Loading>
          {!isHiddenCart && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          
            <div onClick={() => navigate('/order')} style={{cursor: 'pointer',padding: '8px 16px',
              backgroundColor: 'rgb(115, 144, 114)', // màu xanh giống Ant Design
             
              borderRadius: '999px',
              display: 'inline-block',
              fontWeight: '500',
              transition: '0.3s',
              userSelect: 'none'}}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(115, 144, 114)';
                e.currentTarget.style.color = 'white';
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
                e.currentTarget.style.color = 'rgb(115, 144, 114)';
              }}>

                  <Badge count={order?.orderItems?.length} size="small">
                      <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                    </Badge>
              
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div></div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent