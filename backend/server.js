import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cloud-snap-five.vercel.app",
    /^https:\/\/cloud-snap-.*\.vercel\.app$/
  ]
}));
app.use(express.json());

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(putCommand);

    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3, getCommand, {
      expiresIn: 3600,
    });

    return res.status(200).json({
      message: "Upload successful",
      fileKey: fileName,
      fileUrl: signedUrl,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({
      error: "Upload failed",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

console.log("Loaded region:", process.env.AWS_REGION);
console.log("Loaded bucket:", process.env.AWS_BUCKET_NAME);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
