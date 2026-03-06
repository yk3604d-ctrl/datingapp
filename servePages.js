const path = require("path");

function servePages(app) {
app.get("/api/notifications.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notifications.html"));
});

app.get("/api/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
}

module.exports = servePages;