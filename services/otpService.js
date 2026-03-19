const sendEmail = require("../utiiles/sendEmail");

const { generateOtp, saveOtp, verifyOtp } = require("../utiiles/otpStore");

exports.sendOtp = async (email) => {

  const otp = generateOtp();

  saveOtp(email, otp);

  await sendEmail(
    email,
    "OTP Verification",
    `Your OTP is ${otp}. It expires in 2 minutes`
  );

};

exports.verifyOtp = (email, otp) => {

  return verifyOtp(email, otp);

};
