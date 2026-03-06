const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Update account (POST /account/update)
router.post("/update", accountController.updateAccount);

// Get account by phone number (GET /account/:phoneNumber)
router.get("/:phoneNumber", accountController.getAccount);

module.exports = router;
