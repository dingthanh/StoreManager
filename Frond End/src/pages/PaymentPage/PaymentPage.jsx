import {Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
// import { PayPalButton } from "react-paypal-button-v2";
import { createVNPayPayment } from "../../services/PaymentService";




const PaymentPage = () => {
  const user = useSelector((state) => state.user);

  const order = useSelector((state) => state.order)

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady , setSdkReady] = useState(false)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm();

  const dispatch = useDispatch()


  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo,user?.address, user?.city, user?.name, user?.phone])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }


  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * cur.amount * ((totalDiscount / cur.amount)/ 100))
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo > 200000){
      return 10000
    }else if(priceMemo === 0 ){
      return 0
    }else {
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleAddOrder = () => {

    console.log("user.access_token:", user?.access_token);
    console.log("order.orderItemsSlected:", order?.orderItemsSlected);
    console.log("user.name:", user?.name);
    console.log("user.address:", user?.address);
    console.log("user.phone:", user?.phone);
    console.log("user.city:", user?.city);
    console.log("priceMemo:", priceMemo);
    console.log("user.id:", user?.id);
    if(user?.access_token && order?.orderItemsSlected && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
        // eslint-disable-next-line no-unused-expressions
        mutationAddOrder.mutate(
          { 
            token: user?.access_token, 
            orderItems: order?.orderItemsSlected, 
            fullName: user?.name,
            address:user?.address, 
            phone:user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email
          }
        )
      }
  }
  
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )

  const {isLoading} = mutationUpdate
  const {data: dataAdd , isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    // console.log(isSuccess);
    // console.log(dataAdd?.status);
    
    if (isSuccess  && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemsSlected?.forEach(element => {
      arrayOrdered.push(element.product) 
      });
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
      message.success('Đặt hàng thành công')
       navigate('/orderSuccess', {
         state: {
           delivery,
           payment,
           orders: order?.orderItemsSlected,
           totalPriceMemo: totalPriceMemo
         }
       })
    } else if (isError) {
        message.error('Đặt hàng không thành công')
    }
  }, [isSuccess,isError])

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

//   const onSuccessPaypal = (details, data) => {
//     mutationAddOrder.mutate(
//       { 
//         token: user?.access_token, 
//         orderItems: order?.orderItemsSlected, 
//         fullName: user?.name,
//         address:user?.address, 
//         phone:user?.phone,
//         city: user?.city,
//         paymentMethod: payment,
//         itemsPrice: priceMemo,
//         shippingPrice: diliveryPriceMemo,
//         totalPrice: totalPriceMemo,
//         user: user?.id,
//         isPaid :true,
//         paidAt: details.update_time, 
//         email: user?.email
//       }
//     )
//   }


  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  // const handlePaymentVNPay = async () => {
  //   try {
  //     const response = await createVNPayPayment({
  //       amount: priceMemo, 
  //       orderId: "ORDER123",
  //       userId: "USER001", 
  //       orderInfo: "Thanh toan don hang ORDER123",
  //       returnUrl: "http://localhost:5000/payment-result"
  //     });
      
  //     if (response.status === "success" && response.paymentUrl) {
  //       window.location.href = response.paymentUrl;
  //     } else {
  //       alert("Khong tao duoc link thanh toan.");
  //     }
  //   } catch (err) {
  //     console.log(err);
      
  //     // alert("Loi ket noi toi VNPay.");
  //   }
  // };
  
  console.log(" 262  ");

  // const handlePaymentVNPay = async () => {
  //   try {
  //     // Lấy thông tin user
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const userId = user?.id || "GUEST";

  //     console.log(user?.id);
      
      
      
  
  //     // Tính tổng tiền từ giỏ hàng
  //     // const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  //     // Tạo orderId ngẫu nhiên
  //     const orderId = "ORDER_" + Date.now();
  
  //     // Tạo mô tả đơn hàng
  //     const orderInfo = `Thanh toán đơn hàng ${orderId} của người dùng ${userId}`;
  
  //     // Gửi yêu cầu tạo thanh toán
  //     const response = await createVNPayPayment({
  //       // amount: totalAmount,
  //       orderId,
  //       userId,
  //       orderInfo,
  //       returnUrl: "http://localhost:5000/payment-result", // FE sẽ xử lý hiển thị kết quả ở đây
  //     });
  
  //     if (response.status === "success" && response.paymentUrl) {
  //       // Chuyển hướng tới trang thanh toán VNPay
  //       // window.location.href = response.paymentUrl;
  //     } else {
  //       alert("Không thể tạo yêu cầu thanh toán.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi thanh toán:", error);
  //     alert("Có lỗi xảy ra khi tạo yêu cầu thanh toán.");
  //   }
  // };
  

  const handlePaymentVNPay = async () => {
    try {
      // 1. Gửi tạo đơn hàng lên backend
      const res = await OrderService.createOrder(
        {
          orderItems: order?.orderItemsSlected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: "vnpay",
          itemsPrice: priceMemo,
          shippingPrice: diliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          isPaid: false,
          email: user?.email
        },
        user?.access_token
      );
      console.log(res);
      
      if (res?.status === "OK") {
        const createdOrder = res.order;
        const orderId = createdOrder.order._id;
        const amount = createdOrder.order.totalPrice;
  
        console.log("orderId: ",totalPriceMemo);
        console.log("orderId: ",createdOrder.order._id);
        console.log("orderId: ",user?.id);

        // 2. Gọi tới server để tạo VNPay payment
        const paymentRes = await createVNPayPayment({
          amount: amount,
          orderId: orderId,
          userId: user?.id,
          orderInfo: `Thanh toán đơn hàng ${orderId}`,
          returnUrl: "https://storemanagerfe.onrender.com/payment-result"
        })
        if (paymentRes?.data?.status === "success" && paymentRes.data?.paymentUrl) {
          window.location.href = paymentRes.data.paymentUrl;
        } else {
          console.log("Không thể tạo thanh toán VNPay.");
        }
      } else {
        console.log("Không thể tạo đơn hàng.");
      }
    } catch (error) {
      console.log("Lỗi khi xử lý VNPay:", error);
      message.error("Lỗi hệ thống khi thanh toán.");
    }
  };

  // useEffect(() => {
  //   if(!window.paypal) {
  //     addPaypalScript()
  //   }else {
  //     setSdkReady(true)
  //   }
  // }, [])

  return (
    <div style={{background: '#f5f5fa', with: '100%', height: 'auto'}}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3 style={{fontWeight: 'bold', fontSize: '30px', textAlign: 'center', padding: '10px'}}></h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}> 
                    <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="vnpay">Thanh toán bằng VNPay</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{width: '100%'}}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{color: '#fd5555', cursor:'pointer'}}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>Tạm tính</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>Giảm giá</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>Phí giao hàng</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(diliveryPriceMemo)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{display:'flex', flexDirection: 'column'}}>
                    <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                    <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              {/* {payment === 'paypal'  && sdkReady  ? (
                  <div style={{width: '320px'}}>
                    <PayPalButton
                      amount={Math.round(totalPriceMemo / 30000)}
                       //shippingPreference="NO_SHIPPING"  default is "GET_FROM_FILE"
                      onSuccess={onSuccessPaypal}
                      onError={() => {
                        alert('Không Kết Nối')
                      }}
                    />
                 </div>  */}



                    {payment === 'vnpay' ? (
                    <ButtonComponent
                        onClick={handlePaymentVNPay}
                        size={40}
                        styleButton={{
                        background: '#3A4D39',
                        height: '48px',
                        width: '320px',
                        border: 'none',
                        borderRadius: '4px'
                        }}
                        textbutton={'Thanh toán VNPay'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    />

              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                      background: '#3A4D39',
                      height: '48px',
                      width: '320px',
                      border: 'none',
                      borderRadius: '4px'
                  }}
                  textbutton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isLoading}>
          <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}

            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your  phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>

              <Form.Item
                label="Adress"
                name="address"
                rules={[{ required: true, message: 'Please input your  address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage
