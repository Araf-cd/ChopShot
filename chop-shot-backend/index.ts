import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

// Setup folders
const UPLOADS_DIR = path.join(__dirname, "uploads");
const TRANSCRIPTS_DIR = path.join(__dirname, "transcripts");

[UPLOADS_DIR, TRANSCRIPTS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const app = express();
const PORT = 5000;
app.use(cors());

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const videoPath = path.join(UPLOADS_DIR, req.file.filename);
  const outputName = path.parse(req.file.filename).name;
  const transcriptPath = path.join(TRANSCRIPTS_DIR, `${outputName}.txt`);

  const whisperCmd = `whisper "${videoPath}" --model base --output_dir "${TRANSCRIPTS_DIR}" --output_format txt`;

  console.log("Transcribing with Whisper...");
  exec(whisperCmd, (err, stdout, stderr) => {
    if (err) {
      console.error("Whisper error:", stderr);
      return res.status(500).send("Transcription failed.");
    }

    console.log("Transcription complete.");
    res.status(200).json({
      message: "Upload and transcription complete.",
      transcriptPath: `/transcripts/${outputName}.txt`,
    });
  });
});

app.listen(PORT, () => {
  console.log(` Backend listening on http://localhost:${PORT}`);
});

