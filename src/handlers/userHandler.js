import userModel from "../models/mongo/user.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import logger from "../utils/logger.js";
import { uploadToS3 } from "../services/awsS3Service.js";
import { v4 as uuidv4 } from "uuid";
import { generateSummary } from "../services/openaiService.js";
import { extractTextFromPdf } from "../services/textExtractionService.js";

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
        files: user.files.map((file) => ({
          fileId: file._id.toString(),
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          originalName: file.originalName,
          fileType: file.fileType,
          uploadedAt: file.uploadedAt,
          status: file.status,
          summary: file.summary,
          summaryFileName: file.summaryFileName,
          summaryUrl: file.summaryUrl,
          summaryGeneratedAt: file.summaryGeneratedAt,
        })),
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
    if (expectedFileType !== "pdf") {
      throw new Error("Only PDF files are allowed");
    }

    if (file.mimetype !== "application/pdf") {
      logger.warn({
        source: "userHandler:uploadFile",
        message: `${userId} - Invalid file type uploaded`,
        mimeType: file.mimetype,
      });
      return {
        status: HTTP_STATUS.BAD_REQUEST,
        message: "Only PDF files are allowed",
        data: null,
      };
    }

    const extension = "pdf";
    const fileName = `${userId}/${uuidv4()}-${Date.now()}.${extension}`;
    const uploadResult = await uploadToS3(file, fileName);

    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.files.push({
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.fileUrl,
      originalName: file.originalname,
      fileType: "pdf",
      status: "processing",
    });

    await user.save();

    const updatedUser = await userModel.findById(userId);
    const newFile = updatedUser.files.find((f) => f.fileName === uploadResult.fileName);
    if (!newFile) {
      throw new Error("Failed to find newly uploaded file");
    }
    const fileId = newFile._id;

    try {
      const text = await extractTextFromPdf(file.buffer);
      if (!text.trim()) {
        throw new Error("No text extracted from PDF");
      }
      let summary;
      try {
        summary = await generateSummary(text);
      } catch (summaryError) {
        logger.error({
          source: "userHandler:uploadFile",
          message: `${userId} - Error generating summary`,
          meta: { error: summaryError.message, stack: summaryError.stack },
        });
        throw new Error("Failed to generate summary");
      }


      if (typeof summary !== "string" || !summary.trim()) {
        logger.error({
          source: "userHandler:uploadFile",
          message: `${userId} - Invalid summary generated`,
          summaryType: typeof summary,
          summaryValue: summary,
        });
        throw new Error(`Invalid summary generated: type=${typeof summary}`);
      }


      await userModel.updateOne(
        { _id: userId, "files._id": fileId },
        {
          $set: {
            "files.$.status": "ready",
            "files.$.summary": summary,
            "files.$.summaryGeneratedAt": new Date(),
          },
        }
      );

      logger.info({
        source: "userHandler:uploadFile",
        message: `${userId} - File processed successfully`,
        fileName,
      });
    } catch (processingError) {
      await userModel.updateOne(
        { _id: userId, "files._id": fileId },
        { $set: { "files.$.status": "error" } }
      );
      logger.error({
        source: "userHandler:uploadFile",
        message: `${userId} - Error processing file`,
        fileName,
        meta: { error: processingError.message, stack: processingError.stack },
      });
      throw processingError;
    }

    const finalUser = await userModel.findById(userId);
    const updatedFile = finalUser.files.id(fileId);

    return {
      status: HTTP_STATUS.OK,
      message: "File uploaded and processed",
      data: {
        fileId: updatedFile._id.toString(),
        fileName: updatedFile.fileName,
        fileUrl: updatedFile.fileUrl,
        originalName: updatedFile.originalName,
        fileType: updatedFile.fileType,
        uploadedAt: updatedFile.uploadedAt,
        status: updatedFile.status,
        summary: updatedFile.summary, 
        summaryFileName: updatedFile.summaryFileName,
        summaryUrl: updatedFile.summaryUrl,
        summaryGeneratedAt: updatedFile.summaryGeneratedAt,
      },
    };
  } catch (err) {
    logger.error({
      source: "userHandler:uploadFile",
      message: `${userId} - Error uploading file`,
      meta: { error: err.message, stack: err.stack },
    });
    throw err;
  }
};

const listUserFiles = async (userId) => {
  try {
    const user = await userModel.findById(userId).select("files");
    if (!user) {
      logger.warn({
        source: "userHandler:listUserFiles",
        message: `${userId} - User not found`,
      });
      return {
        status: HTTP_STATUS.NOT_FOUND,
        message: "User not found",
        data: [],
      };
    }

    const files = user.files.map((file) => ({
      fileId: file._id.toString(),
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      originalName: file.originalName,
      fileType: file.fileType,
      uploadedAt: file.uploadedAt,
      status: file.status,
      summary: file.summary, 
      summaryFileName: file.summaryFileName,
      summaryUrl: file.summaryUrl,
      summaryGeneratedAt: file.summaryGeneratedAt,
    }));

    logger.info({
      source: "userHandler:listUserFiles",
      message: `${userId} - Retrieved ${files.length} files from database`,
    });

    return {
      status: HTTP_STATUS.OK,
      message: "Files retrieved successfully",
      data: files,
    };
  } catch (err) {
    logger.error({
      source: "userHandler:listUserFiles",
      message: `${userId} - Error retrieving files from database`,
      meta: { error: err.message },
    });
    throw err;
  }
};

export { getUserById, uploadFile, listUserFiles };
