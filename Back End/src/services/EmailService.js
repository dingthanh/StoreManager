const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email,orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'trandinhthanh24112003@gmail.com', // generated ethereal user
      pass: 'sazl bmhx yzek xuhj', // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b></div>
      Số tiền cần thanh toán là: <b>${order.price} VND</b>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
    </div>`
    attachImage.push({path: order.image})
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'trandinhthanh24112003@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt hàng tại shop ", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop </b></div> ${listItem}`,
    attachments: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}