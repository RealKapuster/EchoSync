import nextConnect from "next-connect";
import multer, { type FileFilterCallback } from "multer";
import axios from "axios";
import FormData from "form-data";
import { type NextApiRequest, type NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ExtendedNextApiRequest extends NextApiRequest {
  file?: {
    buffer: Buffer;
    originalname: string;
  };
}

const upload = multer({
  fileFilter: (_, file, callback: FileFilterCallback) => {
    console.log("filter");
    const validMimeTypes = ["audio/wav", "audio/mpeg", "audio/m4a"];
    if (!validMimeTypes.includes(file.mimetype)) {
      callback(new Error("Invalid file type"));
    } else {
      callback(null, true);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB in bytes
  },
});

const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>({
  onError: (error, _, res) => {
    if (error instanceof multer.MulterError) {
      res.status(400).json({ error: "File size limit exceeded" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  },
});

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file received" });
    }

    const formData = new FormData();

    formData.append("file", file.buffer, { filename: file.originalname });
    formData.append("model", "whisper-1");

    if (OPENAI_API_KEY === undefined) {
      return res
        .status(200)
        .json({
          text: "test test speech to text test. (OPENAI_API_KEY not found)",
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
