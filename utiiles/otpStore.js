const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveOtp(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 2 * 60 * 1000 // 2 minutes
  });
}

function verifyOtp(email, userOtp) {
  const data = otpStore.get(email);

  if (!data) {
    return { success: false, message: "OTP not found" };
  }

  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);
    return { success: false, message: "OTP expired" };
  }

  if (data.otp !== userOtp) {
    return { success: false, message: "Invalid OTP" };
  }

  otpStore.delete(email);

  return { success: true };
}

module.exports = { generateOtp, saveOtp, verifyOtp };
