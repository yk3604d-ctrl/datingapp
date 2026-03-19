exports.sendNotification = (req, res) => {
  const { toUserId, title, subtitle, message } = req.body;
  const sendNotification = req.app.locals.sendNotification;

  const notification = {
    title,
    subtitle: subtitle || "",
    message,
    time: new Date()
  };

  sendNotification(toUserId, notification);
  res.json({ code: "NC0", message: "Notification sent", data: notification });
};