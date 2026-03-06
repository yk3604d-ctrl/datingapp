const DatingProfile = require("../models/datingProfile");

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await DatingProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get profile by phone number
exports.getProfileByPhone = async (req, res) => {
  try {
    const profile = await DatingProfile.findOne({ phoneNumber: req.params.phoneNumber });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const newProfile = new DatingProfile({ phoneNumber });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add a prompt
exports.addPrompt = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { question, answer } = req.body;

    const profile = await DatingProfile.findOne({ phoneNumber });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.prompts.push({ question, answer });
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add tags
exports.addTags = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { tags } = req.body; // expect array of strings

    const profile = await DatingProfile.findOne({ phoneNumber });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.tags = [...new Set([...profile.tags, ...tags])]; // avoid duplicates
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update dating intent
exports.updateDatingIntent = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { lookingFor, marriageIntent, openToRelocation } = req.body;

    const profile = await DatingProfile.findOne({ phoneNumber });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.datingIntent = { lookingFor, marriageIntent, openToRelocation };
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const deleted = await DatingProfile.findOneAndDelete({ phoneNumber });
    if (!deleted) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};