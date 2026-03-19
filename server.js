require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes");
const genderRoughter=require("./routes/genderRoutes")
const profileDetail=require("./routes/ProfileOnbordRoutes")
const uploadMedia=require("./routes/uploadMedia")
const starRoutes = require("./routes/starRoutes");
const startSocketServer = require("./socket/socketServer");
const notificationRoutes = require("./routes/notificationRoutes");
const startNotificationServer = require("./socket/notificationServer");
const chatRoutes = require("./routes/chatRoutes");
const Privacy=require("./routes/PrivacyRoutes")
const Accounts=require("./routes/accountRoutes")
const Location=require("./routes/locationRoutes")
const Media=require("./routes/mediaRoutes")
const engagement=require("./routes/engagementRoutes")
const Friends=require("./routes/connectionsRoutes")
const datingProfile=require("./routes/datingProfileRoutes")
const themeRoutes = require("./routes/themeRoutes");
const themeListRoutes = require("./routes/themeListRoutes");
const otpRoutes = require("./routes/otpRoutes");
const app = express();
app.use(express.json());

// DB Connect
connectDB();



//testing
app.use(cors({
  origin: "*"
}));
// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "Server is running"
  });
});

const { sendNotification } = startNotificationServer(process.env.NOTIFY_PORT || 5002);
app.locals.sendNotification = sendNotification;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gender",genderRoughter);
app.use("/api/profileDetail",profileDetail);
app.use("/api/uploadmedia",uploadMedia)
app.use("/api/chat", chatRoutes);
app.use("/api/star", starRoutes);
app.use("/api/privacy",Privacy)
app.use("/api/accounts",Accounts)
app.use("/api/locatation",Location)
app.use("/api/media",Media)
app.use("/api/engagement",engagement)
app.use("/api/friendes",Friends)
app.use("/api/datingProfile",datingProfile)
app.use("/api/notify", notificationRoutes);
app.use("/api/apptheme", themeRoutes);
app.use("/api/appthemeList", themeListRoutes);
app.use("/api/otp", otpRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

startSocketServer(process.env.SOCKET_PORT);

