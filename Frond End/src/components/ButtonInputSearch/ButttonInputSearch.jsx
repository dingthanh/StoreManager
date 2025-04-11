// import { Button } from 'antd'
// import React from 'react'
// import { SearchOutlined } from '@ant-design/icons'
// import InputComponent from '../InputComponent/InputComponent'
// import ButtonComponent from '../ButtonComponent/ButtonComponent'

// const ButttonInputSearch = (props) => {
//   const {
//     size, placeholder, textbutton,
//     bordered, backgroundColorInput = '#fff',
//     backgroundColorButton = '#ff6961',
//     colorButton = '#fff'
//   } = props

//   return (
//     <div style={{ display: 'flex', }}>
//       <InputComponent
//         size={size}
//         placeholder={placeholder}
//         bordered={bordered}
//         style={{ backgroundColor: backgroundColorInput , borderRadius: '15px 0px 0px 15px' }}
//         {...props}
//       />
//       <ButtonComponent
//         size={size}
//         styleButton={{ background: backgroundColorButton, fontWeight: 'bold' , borderRadius: '0px 15px 15px 0px'}}
//         icon={<SearchOutlined color={colorButton} style={{ color: '#fff' , fontWeight: 'bold'}} />}
//         textbutton={textbutton}
//         styleTextButton={{ color: colorButton }}
//       />
//     </div>
//   )
// }

// export default ButttonInputSearch

import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButttonInputSearch = (props) => {
  const {
    size, placeholder, textbutton,
    bordered, backgroundColorInput = '#fff',
    backgroundColorButton = '#ff6961',
    colorButton = '#fff',
    onSearch, // <- thêm vào
    onChange, // <- thêm để truyền xuống InputComponent
    onKeyDown={onKeyDown}
  } = props

  return (
    <div style={{ display: 'flex' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ backgroundColor: backgroundColorInput, borderRadius: '15px 0px 0px 15px' }}
        onChange={onChange}
        onKeyDown={onKeyDown} // <- truyền xuống input
      />
      <ButtonComponent
        size={size}
        styleButton={{ background: backgroundColorButton, fontWeight: 'bold', borderRadius: '0px 15px 15px 0px' }}
        icon={<SearchOutlined color={colorButton} style={{ color: '#fff', fontWeight: 'bold' }} />}
        textbutton={textbutton}
        styleTextButton={{ color: colorButton }}
        onClick={onSearch} // <- gán sự kiện click
      />
    </div>
  )
}

export default ButttonInputSearch
