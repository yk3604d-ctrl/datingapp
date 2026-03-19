const UserCore = require("../models/userCore");
const Media =require("../models/media")
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

exports.uploadProfilePhoto = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        code: "UPM1",
        message: "Phone number required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        code: "UPM2",
        message: "File required"
      });
    }

    const user = await UserCore.findById(phoneNumber);

    if (!user) {
      return res.status(404).json({
        code: "UPN1",
        message: "User not found"
      });
    }

    let uploadResult;

    // ================= IMAGE =================
    if (req.fileType === "image") {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "dating-app/profile",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }]
      });

      user.profilePhoto = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        type: "image"
      };
    }

    // ================= VIDEO =================
    if (req.fileType === "video") {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "dating-app/video",
        resource_type: "video"
      });

      // Validate duration (max 10 sec)
      if (uploadResult.duration > 10) {
        // delete uploaded video
        await cloudinary.uploader.destroy(uploadResult.public_id, {
          resource_type: "video"
        });

        return res.status(400).json({
          code: "UPV3",
          message: "Video must be 10 seconds or less"
        });
      }

      user.introVideo = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: uploadResult.duration,
        type: "video"
      };
    }

    await user.save();

    // Delete temp file
    fs.unlinkSync(req.file.path);

    return res.json({
      code: "UPS0",
      message: "Upload successful",
      data: uploadResult.secure_url
    });

  } catch (err) {
    return res.status(500).json({
      code: "UPE99",
      message: err.message
    });
  }
};

exports.uploadGalleryMedia = async (req, res) => {
  try {
    const { phoneNumber, isProfile } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        code: "MED1",
        message: "Phone number required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        code: "MED2",
        message: "File required"
      });
    }

    let uploadResult;

    // ================= IMAGE =================
    if (req.fileType === "image") {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "dating-app/media",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }]
      });
    }

    // ================= VIDEO =================
    if (req.fileType === "video") {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "dating-app/media",
        resource_type: "video"
      });
    }

    // ================= FIND OR CREATE DOC =================
    let mediaDoc = await Media.findOne({ phoneNumber });

    if (!mediaDoc) {
      mediaDoc = new Media({
        phoneNumber,
        items: []
      });
    }

    const newItem = {
      url: uploadResult.secure_url,
      type: req.fileType,
      thumbnail: uploadResult.secure_url,
      isProfile: isProfile === "true" || isProfile === true,
      uploadedAt: new Date()
    };

    mediaDoc.items.push(newItem);

    await mediaDoc.save();

    // delete temp file
    fs.unlinkSync(req.file.path);

    return res.json({
      code: "MED0",
      message: "Media uploaded successfully",
      data: newItem
    });

  } catch (err) {
    return res.status(500).json({
      code: "MED99",
      message: err.message
    });
  }
};