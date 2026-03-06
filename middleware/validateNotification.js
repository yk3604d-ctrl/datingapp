module.exports = (req, res, next) => {
  const { toUserId, title, message } = req.body;
  if (!toUserId || !title || !message) {
    return res.status(400).json({ code: "NC1", message: "Missing required fields" });
  }
  next();
};