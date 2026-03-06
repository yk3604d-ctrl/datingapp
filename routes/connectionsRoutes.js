const express = require("express");
const router = express.Router();
const connectionsController = require("../controllers/connectionsController");

// Connections CRUD
router.get("/", connectionsController.getAllConnections);
router.get("/:phoneNumber", connectionsController.getConnectionByPhone);
router.post("/", connectionsController.createConnection);
router.delete("/:phoneNumber", connectionsController.deleteConnection);

// Friends & Partners
router.post("/:phoneNumber/friends", connectionsController.addFriend);
router.post("/:phoneNumber/partners", connectionsController.addPartner);

module.exports = router;