import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  logdnaMezmoKey: process.env.LOGDNA_MEZMO_INGESTION_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  awsRegion: process.env.AWS_REGION,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsBucketName: process.env.AWS_BUCKET_NAME,
};

export default config;
