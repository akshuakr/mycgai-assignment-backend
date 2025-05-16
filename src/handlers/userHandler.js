import userModel from "../models/mongo/user.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import logger from "../utils/logger.js";
import { uploadToS3 } from "../services/awsS3Service.js";
import { v4 as uuidv4 } from "uuid";

const getUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      logger.warn({
        source: "userHandler:getUserById",
        message: `${userId} - User not found in database`,
      });
      return {
        status: HTTP_STATUS.NOT_FOUND,
        message: "User not found",
        data: null,
      };
    }
    logger.info({
      source: "userHandler:getUserById",
      message: `${userId} - User found in database`,
    });
    return {
      status: HTTP_STATUS.OK,
      message: "User details retrieved successfully",
      data: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (err) {
    logger.error({
      source: "userHandler:getUserById",
      message: `${userId} - Unexpected error during finding user`,
      user: userId,
      meta: { error: err.message },
    });
    throw err;
  }
};

const uploadFile = async (userId, file, expectedFileType) => {
  try {
    // Validate file type
    let validMimeTypes;
    if (expectedFileType === "pdf") {
      validMimeTypes = ["application/pdf"];
    } else if (expectedFileType === "image") {
      validMimeTypes = ["image/jpeg", "image/png"];
    } else {
      throw new Error("Unsupported file type");
    }

    if (!validMimeTypes.includes(file.mimetype)) {
      logger.warn({
        source: "userHandler:uploadFile",
        message: `${userId} - Invalid file type uploaded`,
        mimeType: file.mimetype,
      });
      return {
        status: HTTP_STATUS.BAD_REQUEST,
        message: `Only ${expectedFileType} files are allowed`,
        data: null,
      };
    }

    const extension = file.mimetype.split("/")[1];
    const fileName = `${userId}/${uuidv4()}-${Date.now()}.${extension}`;
    const uploadResult = await uploadToS3(file, fileName);

    // Save file details in the database
    const user = await userModel.findById(userId);
    user.files.push({
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.fileUrl,
      originalName: file.originalname,
      fileType: expectedFileType,
    });
    await user.save();

    logger.info({
      source: "userHandler:uploadFile",
      message: `${userId} - File uploaded and saved`,
      fileName,
    });

    return {
      status: HTTP_STATUS.OK,
      message: "File uploaded successfully",
      data: {
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
      },
    };
  } catch (err) {
    logger.error({
      source: "userHandler:uploadFile",
      message: `${userId} - Error uploading file`,
      meta: { error: err.message },
    });
    throw err;
  }
};

export { getUserById, uploadFile };
