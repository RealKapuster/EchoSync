import { FILE_SIZE_LIMIT } from "./../../constants";
import nextConnect from "next-connect";
import multer, { type FileFilterCallback } from "multer";
import axios from "axios";
import FormData from "form-data";
import { type NextApiRequest, type NextApiResponse } from "next";
import { transcriptionMockData } from "./../../utils/mockData";

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_KEY = null;

interface ExtendedNextApiRequest extends NextApiRequest {
  file?: {
    buffer: Buffer;
    originalname: string;
  };
  body: { mock?: "true" | "false" };
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const upload = multer({
  fileFilter: (_, file, callback: FileFilterCallback) => {
    const validMimeTypes = ["audio/wav", "audio/mpeg", "audio/m4a"];
    if (!validMimeTypes.includes(file.mimetype)) {
      callback(new ValidationError("Invalid file type"));
    } else {
      callback(null, true);
    }
  },
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
});

const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>({
  onError: (error: Error, _, res) => {
    if (
      error instanceof multer.MulterError ||
      error instanceof ValidationError
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
});

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  try {
    const file = req.file;
    const mock = req.body.mock?.toLowerCase() === "true";

    if (!file) {
      return res.status(400).json({ message: "No file received" });
    }

    const formData = new FormData();

    formData.append("file", file.buffer, { filename: file.originalname });
    formData.append("model", "whisper-1");

    if (!OPENAI_API_KEY || mock) {
      return res.status(200).json({
        text: `${transcriptionMockData.transcription}`,
      });
    }

    const response = await axios({
      method: "POST",
      url: "https://api.openai.com/v1/audio/transcriptions",
      headers: {
        "Content-Type": `multipart/form-data;`,
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      data: formData,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
