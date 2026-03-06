const { v2: cloudinary } = require("cloudinary");


cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.Cloud_API_key,
  api_secret: process.env.Cloud_API_secret
});

module.exports = cloudinary;
