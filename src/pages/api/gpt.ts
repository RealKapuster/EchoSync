import nextConnect from "next-connect";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionResponseMessage,
} from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { gptMockData } from "~/utils/mockData";
import { get_encoding } from "@dqbd/tiktoken";
const gptEncoder = get_encoding("cl100k_base");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export type PromptType =
  | "Tweet"
  | "Blog"
  | "Newsletter"
  | "Lens"
  | "MeetingNotes";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    text: string;
    promptType?: PromptType;
    mock?: boolean;
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
    "Summarize the following text and it should be concise and informative, providing key takeaways and insights.";

  switch (promptType) {
    case "Tweet":
      message =
        "Convert the following text into a Twitter thread. A Twitter thread should be concise and informative, providing key takeaways and insights that would be of interest to your audience. Consider breaking up the text into 5-10 tweets, each containing a single main point or idea. Try to use bullet points, short sentences, and impactful language to make the tweets engaging and easy to read.";
      break;
    case "Blog":
      message =
        "You are an excellent public relations specialist. Convert the given text into a blog post.";
      break;
    case "Newsletter":
      message =
        "You are an excellent public relations specialist. Convert the given text into a newsletter format.";
      break;
    case "Lens":
      message =
        "Convert the following text to a Lens post format(web3 social protocol). A Lens post should be concise and informative, providing key takeaways and insights. Consider using bullet points or short paragraphs to make the content easy to read and digest. Additionally, try to use hashtags to make the post more discoverable and relevant to the Lens community.";
      break;

    case "MeetingNotes":
      message =
        "Convert the following text into meeting notes. Meeting notes should be concise and informative, providing key takeaways and action items discussed during the meeting. Consider breaking up the text into bullet points or short paragraphs, each containing a single main point or action item. Try to use clear and straightforward language to make the notes easy to read and understand.";
      break;
    default:
      message =
        "Summarize the following text and it should be concise and informative, providing key takeaways and insights.";
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

  if (!OPENAI_API_KEY || req.body.mock) {
    return res.status(200).json({
      role: "user",
      content: `${gptMockData[prompt || "Tweet"]}`,
    });
  }

  try {
    const content = await summarize(req.body.text);

    const messages: ChatCompletionResponseMessage[] = [
      getSystemPrompt(prompt),
      { role: "user", content: content },
    ];

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

function chunkArray(array: Uint32Array, chunkSize: number): number[][] {
  let chunks: number[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(Array.from(array.slice(i, i + chunkSize)));
  }
  return chunks;
}

const summarize = async (text: string) => {
  const maxTokenLength = 4096 - 1000;
  const tokens = gptEncoder.encode(text);
  if (tokens.length < maxTokenLength) {
    return text;
  }

  const numChunks = Math.ceil(tokens.length / maxTokenLength); // calculate number of chunks
  const chunkSize = Math.ceil(tokens.length / numChunks); // calculate chunk size

  const tokenChunks = chunkArray(tokens, chunkSize);
  let summaryChunks: string[] = [];

  for (let i = 0; i < tokenChunks.length; i++) {
    const chunkText = new TextDecoder().decode(
      gptEncoder.decode(Uint32Array.from(tokenChunks[i]!))
    );
    const messages: ChatCompletionResponseMessage[] = [
      getSystemPrompt(),
      { role: "user", content: chunkText },
    ];

    try {
      const baseCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: Math.floor(maxTokenLength / tokenChunks.length),
        messages: messages,
      });
      const summary = baseCompletion?.data?.choices?.[0]?.message?.content;

      // console.log("summary: ", summary);
      summaryChunks.push(summary!);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  const finalSummary = summaryChunks.join("");
  return finalSummary;
};
