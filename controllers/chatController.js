exports.sendTestMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({
        code: "UC1",
        message: "Missing fields"
      });
    }

    return res.json({
      code: "UC0",
      message: "Use WebSocket for real-time messaging",
      data: { from, to, message }
    });

  } catch (err) {
    return res.status(500).json({
      code: "UC99",
      message: err.message
    });
  }
};
