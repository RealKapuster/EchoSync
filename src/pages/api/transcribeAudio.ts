import nextConnect from "next-connect";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Extend the NextApiRequest type to include the 'file' property
interface ExtendedNextApiRequest extends NextApiRequest {
  file: any;
}

const upload = multer();
const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

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
    sizeLimit: "1mb",
  },
};