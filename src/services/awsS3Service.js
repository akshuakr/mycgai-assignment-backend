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

    logger.debug({
      source: "awss3Service:uploadToS3",
      message: "Upload input",
      fileType: typeof file,
      fileIsObject: file && typeof file === "object",
      hasBuffer: file && "buffer" in file,
      fileName,
    });


    const isMulterFile = file && typeof file === "object" && "buffer" in file;
    const body = isMulterFile ? file.buffer : file;


    if (!Buffer.isBuffer(body)) {
      logger.error({
        source: "awss3Service:uploadToS3",
        message: "Invalid file buffer",
        fileType: typeof body,
        fileValue: body,
        fileName,
      });
      throw new Error("Invalid file buffer");
    }


    const contentType =
      isMulterFile && file.mimetype
        ? file.mimetype
        : mime.lookup(fileName) || "application/octet-stream";

    const params = {
      Bucket: config.awsBucketName,
      Key: fileName,
      Body: body,
      ContentType: contentType,
      ContentLength: body.length,
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
      meta: { error: err.message, stack: err.stack },
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
