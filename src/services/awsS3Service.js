import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import fs from "fs";
import config from "../config/mainConfig.js";
import logger from "../utils/logger.js";

const s3Client = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

const uploadToS3 = async (file, fileName) => {
  try {
    const params = {
      Bucket: config.awsBucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      //   ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com/${fileName}`;
    logger.info({
      source: "awss3Service:uploadToS3",
      message: `File uploaded to S3`,
      fileName,
    });

    return {
      fileUrl,
      fileName,
    };
  } catch (err) {
    logger.error({
      source: "awss3Service:uploadToS3",
      message: `Error uploading file to S3`,
      meta: { error: err.message },
    });
    throw err;
  }
};

export { uploadToS3 };

// === TEST CODE ===

// const localFilePath = "/Users/akshu/Downloads/Akshansh_12_May_2025.pdf";
// const fileBuffer = fs.readFileSync(localFilePath);
// const fileMimetype = mime.lookup(localFilePath);

// const testFile = {
//   buffer: fileBuffer,
//   mimetype: fileMimetype,
// };

// const fileName = "sample.pdf";

// uploadToS3(testFile, fileName)
//   .then((res) => console.log("Uploaded:", res))
//   .catch((err) => console.error("Error:", err));
