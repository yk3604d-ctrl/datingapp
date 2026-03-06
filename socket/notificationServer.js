const http = require("http");
const { Server } = require("socket.io");

const startNotificationServer = (port = 5002) => {
  const server = http.createServer();
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET","POST"] }
  });
console.log("notification ON on this port",port)
  const onlineUsers = new Map(); // userId -> socket.id

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Register user ID on connect
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User registered for notifications: ${userId}`);
    });

    // Optional: handle disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (let [user, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(user);
          break;
        }
      }
    });
  });

  // Helper to send notification to a specific user
  const sendNotification = (toUserId, notification) => {
    if (onlineUsers.has(toUserId)) {
      io.to(onlineUsers.get(toUserId)).emit("notification", notification);
      console.log(`Notification sent to ${toUserId}:`, notification);
    } else {
      console.log(`User ${toUserId} is offline, notification not sent.`);
    }
  };

  server.listen(port, () => {
    console.log(`✅ Notification WebSocket Server running on port ${port}`);
  });

  return { io, sendNotification };
};

module.exports = startNotificationServer;