const otpService = require("../services/otpService");

exports.sendOtp = async (req, res) => {
  try {

    const { email } = req.body;

    await otpService.sendOtp(email);

    res.json({
      success: true,
      code:"00",
      message: "OTP sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      code:"OV!",
      message: error.message
    });

  }
};

exports.verifyOtp = async (req, res) => {

  const { email, otp } = req.body;

  const result = otpService.verifyOtp(email, otp);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({
    success: true,
     code:"00",
    message: "OTP verified"
  });

};
