import nextConnect from "next-connect";
import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

interface gptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    messages: gptMessage[];
  };
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const SYSTEM_PROMPT = "";

const systemMessage: gptMessage = {
  role: "system",
  content: SYSTEM_PROMPT,
};

const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  console.log(req.body.messages);

  try {
    const baseCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...req.body.messages],
    });

    const message = baseCompletion?.data?.choices?.[0]?.message;
    console.log(message);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default handler;
