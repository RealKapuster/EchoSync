import nextConnect from "next-connect";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
} from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { gptMockData } from "~/utils/mockData";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export type PromptType = "Tweet" | "Blog" | "Newsletter";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    text: string;
    promptType?: PromptType;
  };
}

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// TODO: need better prompt design!!!
const getSystemPrompt = (
  promptType?: PromptType
): ChatCompletionResponseMessage => {
  let message =
    "You are an excellent public relations specialist. Please summarize the given text";

  switch (promptType) {
    case "Tweet":
      message =
        "You are an excellent public relations specialist. Convert the given text into a Twitter thread format with each thread separated by a line break.";
      break;
    case "Blog":
      message =
        "You are an excellent public relations specialist. Convert the given text into a blog post.";
      break;
    case "Newsletter":
      message =
        "You are an excellent public relations specialist. Convert the given text into a newsletter format.";
      break;
  }

  return {
    role: "system",
    content: message,
  };
};

const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const prompt = req.body.promptType;

  const messages: ChatCompletionResponseMessage[] = [
    getSystemPrompt(prompt),
    { role: "user", content: req.body.text },
  ];

  if (!OPENAI_API_KEY) {
    return res.status(200).json({
      role: "user",
      content: `${gptMockData[prompt || "Tweet"]}`,
    });
  }

  try {
    const baseCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const message = baseCompletion?.data?.choices?.[0]?.message;
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default handler;
