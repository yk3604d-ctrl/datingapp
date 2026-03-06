const StarMessage = require("../models/starMessage");

exports.toggleStarMessage = async (req, res) => {
  try {
    const {
      ownerPhone,
      chatWith,
      messageId,
      sender,
      message,
      mediaUrl,
      messageType,
      reaction
    } = req.body;

    if (!ownerPhone || !chatWith || !messageId) {
      return res.status(400).json({
        code: "USM1",
        message: "Required fields missing"
      });
    }

    const existing = await StarMessage.findOne({
      ownerPhone,
      messageId
    });

    // Unstar if exists
    if (existing) {
      await existing.deleteOne();

      return res.json({
        code: "USM2",
        message: "Message unstarred"
      });
    }

    // Star new
    const star = new StarMessage({
      ownerPhone,
      chatWith,
      messageId,
      sender,
      message,
      mediaUrl,
      messageType,
      reaction
    });

    await star.save();

    return res.json({
      code: "USM0",
      message: "Message starred",
      data: star
    });

  } catch (err) {
    return res.status(500).json({
      code: "USM99",
      message: err.message
    });
  }
};
exports.getStarMessages = async (req, res) => {
  try {
    const { ownerPhone } = req.params;

    const messages = await StarMessage.find({ ownerPhone })
      .sort({ createdAt: -1 });

    return res.json({
      code: "USM0",
      message: "Star messages fetched",
      data: messages
    });

  } catch (err) {
    return res.status(500).json({
      code: "USM99",
      message: err.message
    });
  }
};
