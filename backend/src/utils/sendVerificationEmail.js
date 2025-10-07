import nodemailer from "nodemailer";

export const sendVerificationEmail = async (userEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // có thể đổi sang smtp khác (Mailtrap, Outlook, v.v.)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

    const mailOptions = {
      from: `"AI Assistant" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Xác minh tài khoản của bạn",
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333">
          <h2>Chào mừng bạn đến với AI Assistant 🎉</h2>
          <p>Cảm ơn bạn đã đăng ký! Vui lòng nhấn nút dưới đây để xác minh tài khoản:</p>
          <a href="${verifyLink}" 
             style="display:inline-block; margin-top:10px; padding:10px 20px; background-color:#4F46E5; color:white; text-decoration:none; border-radius:6px;">
            Xác minh ngay
          </a>
          <p>Nếu bạn không tạo tài khoản, vui lòng bỏ qua email này.</p>
          <hr/>
          <small>Link xác minh sẽ hết hạn sau 1 giờ.</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📨 Verification email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Không thể gửi email xác minh.");
  }
};
