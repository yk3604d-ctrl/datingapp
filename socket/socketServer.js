const http = require("http");
const { Server } = require("socket.io");

const startSocketServer = (port = 5001) => {
  const server = http.createServer();
  const io = new Server(server, { cors: { origin: "*", methods: ["GET","POST"] } });

  const onlineUsers = new Map(); // userId -> socket.id
  const offlineMessages = new Map(); // userId -> [messages]

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Register user automatically
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User registered: ${userId}`);

      // Send any offline messages
      if (offlineMessages.has(userId)) {
        offlineMessages.get(userId).forEach(msg => {
          socket.emit("receiveMessage", msg);
        });
        offlineMessages.delete(userId);
      }
    });

    // Handle sending messages
    socket.on("sendMessage", ({ from, to, message }) => {
      const payload = { from, to, message, time: new Date() };

      // Send to receiver if online
      if (onlineUsers.has(to)) {
        io.to(onlineUsers.get(to)).emit("receiveMessage", payload);
      } else {
        // Store offline message
        if (!offlineMessages.has(to)) offlineMessages.set(to, []);
        offlineMessages.get(to).push(payload);
      }

      // Send to sender
      io.to(socket.id).emit("receiveMessage", payload);
    });

    // Handle disconnect
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

  server.listen(port, () => {
    console.log(`✅ Socket Server running on port ${port}`);
  });
};

module.exports = startSocketServer;