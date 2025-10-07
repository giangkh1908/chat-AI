import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },                   // tên người dùng
  email: { type: String, required: true, unique: true },    // email duy nhất
  password: { type: String, required: false },              // local user có password, FB user thì null
  facebookId: { type: String, unique: true, sparse: true }, // id từ Facebook
  isVerified: { type: Boolean, default: false },            // local user cần verify email, FB user có thể set auto true
  verificationToken: { type: String },                      // token xác minh email
  verificationTokenExpires: { type: Date }                  // hạn token
}, { timestamps: true }); // tự động thêm createdAt, updatedAt

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
