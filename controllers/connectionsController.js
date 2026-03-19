const Connections = require("../models/connectionsSchema ");

// Get all connections
exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connections.find();
    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get connection by phone number
exports.getConnectionByPhone = async (req, res) => {
  try {
    const connection = await Connections.findOne({ phoneNumber: req.params.phoneNumber });
    if (!connection) return res.status(404).json({ message: "Connection not found" });
    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Create a new connection
exports.createConnection = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const newConnection = new Connections({ phoneNumber });
    await newConnection.save();
    res.status(201).json(newConnection);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add friend to a connection
exports.addFriend = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { name, phoneNumber: friendPhone } = req.body;

    const connection = await Connections.findOne({ phoneNumber });
    if (!connection) return res.status(404).json({ message: "Connection not found" });

    connection.friends.push({ name, phoneNumber: friendPhone, addedAt: new Date() });
    await connection.save();

    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add partner to a connection
exports.addPartner = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { userId, name, phoneNumber: partnerPhone, status } = req.body;

    const connection = await Connections.findOne({ phoneNumber });
    if (!connection) return res.status(404).json({ message: "Connection not found" });

    connection.partners.push({ userId, name, phoneNumber: partnerPhone, status, startedAt: new Date() });
    await connection.save();

    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a connection
exports.deleteConnection = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const deleted = await Connections.findOneAndDelete({ phoneNumber });
    if (!deleted) return res.status(404).json({ message: "Connection not found" });
    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};