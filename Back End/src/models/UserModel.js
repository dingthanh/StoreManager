const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        // password: { type: String, required: true },
        password: {
            type: String,
            required: function () {
              return !this.sub;  // Nếu không có googleUserId thì mới cần password
            }
          },
          sub: {
            type: String,
            unique: true,
            sparse: true // Cho phép null không trùng
          },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: Number },
        address: { type: String },
        avatar: { type: String },
        city: {type: String}
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;