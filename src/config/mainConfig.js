import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  logdnaMezmoKey: process.env.LOGDNA_MEZMO_INGESTION_KEY,
};

export default config;
