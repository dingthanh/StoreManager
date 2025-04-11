import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { useState } from 'react'
import { useEffect } from 'react'
import * as ProductService from '../../services/ProductService'

export default function FooterComponent() {
  //Lọc sản phẩm
  const [typeProducts, setTypeProducts] = useState([])
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])
  return (
    
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted' style={{ fontSize: '15px'}}>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom' style={{ color: '#fff', background:  '#739072', borderBottom: '5px solid black'}} >
        <div className='me-5 d-none d-lg-block'>
          <span style={{ paddingLeft: '95px'}} >KHOÁ LUẬN</span>
        </div>

        <div style={{ paddingRight: '95px'}} >
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='light' fab icon='facebook-f' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='light' fab icon='twitter' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='light' fab icon='google' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='light' fab icon='instagram' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='light' fab icon='linkedin' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='light' fab icon='github' />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon color='secondary' icon='gem' className='me-3' />
                NHÀ SÁCH DO T LÀM 
              </h6>
              <p>
                Chào mừng đên với chuỗi cửa hàng online sách 
              </p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Sản Phẩm</h6>
              {/* <p>
                <a href='#!' className='text-reset'>
                  Angular
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  React
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Vue
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Laravel
                </a>
              </p> */}
              <p style={{display: 'flex', flexDirection: 'column',gap: '5px', textAlign: 'left'}}>
                {typeProducts.map((item) => {
                    return (
                    <TypeProduct name={item} key={item}/>
                    )
                })}
                </p>
              
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              {/* <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Pricing
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Settings
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Orders
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Help
                </a>
              </p> */}
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3725.251882931714!2d105.83721307611587!3d20.982537980655316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDU4JzU3LjEiTiAxMDXCsDUwJzIzLjIiRQ!5e0!3m2!1svi!2s!4v1744195932926!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
              width='100%'
              height='150' // hoặc 200
              style={{ border: '0' }}
              loading='lazy'
            ></iframe>
          
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                Hải Phòng
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' />
              </p>
              <p>
                <MDBIcon color='secondary' icon='print' className='me-3' />
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        
        <a className='text-reset fw-bold' href='http://localhost:5000/'>
          TRẦN ĐÌNH THÀNH
        </a>
      </div>
    </MDBFooter>
  );
}