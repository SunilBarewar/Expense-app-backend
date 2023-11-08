const S3 = require("../utils/aws-config");

const uploadToS3 = async (res, filename, data) => {
  const params = {
    Key: filename,
    Bucket: process.env.S3_BUCKET_NAME,
    Body: data,
    ACL: "public-read",
  };

  S3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "failed to upload file" });
    }
    return res.status(200).json({
      fileURL: data.Location,
      message: "file uploaded successfully!",
    });
  });
};

module.exports = uploadToS3;
