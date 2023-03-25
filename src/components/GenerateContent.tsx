import { useState } from "react";
import {
  Button,
  Form,
  message,
  Radio,
  RadioChangeEvent,
  Spin,
  Typography,
} from "antd";
import { CopyTwoTone } from "@ant-design/icons";
import { ChatCompletionResponseMessage } from "openai";
import { PromptType } from "~/pages/api/gpt";
import axios from "axios";
const { Text } = Typography;

const GenerateContent = ({ transcript }: { transcript: string }) => {
  const [isError, setIsError] = useState(false);
  const [promptType, setPromptType] = useState<PromptType>("Lens");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleSubmitTranscription = async () => {
    if (!transcript) {
      console.error("No transcription");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post<ChatCompletionResponseMessage>(
        "/api/gpt",
        { text: transcript, promptType: promptType, mock: true }
      );

      console.log(response.data);
      setContent(response.data.content);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Internal Server Error";

      message.error(errorMessage);
      console.error(error);
    }

    setLoading(false);
  };
  const handlePromptTypeChange = (e: RadioChangeEvent) => {
    setPromptType(e.target.value);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content || "");
    message.success("Copied to clipboard!");
  };

  return (
    <Form
      onFinish={() => void handleSubmitTranscription()}
      fields={[
        {
          name: ["promptType"],
          value: promptType,
        },
      ]}
      className="mt-10"
    >
      <Form.Item className="mb-0" name="promptType">
        <Radio.Group onChange={handlePromptTypeChange}>
          <Radio value="Lens">Lens</Radio>
          <Radio value="Tweet">Tweet</Radio>
          <Radio value="MeetingNotes">MeetingNotes</Radio>
          {/* <Radio value="Blog">Blog</Radio>
          <Radio value="Newsletter">Newsletter</Radio> */}
        </Radio.Group>
      </Form.Item>
      <Form.Item className="pt-0">
        <Button
          type="primary"
          htmlType="submit"
          disabled={!transcript || loading}
          style={{ marginTop: "16px" }}
        >
          Convert
        </Button>
      </Form.Item>
      <CopyTwoTone onClick={handleCopyContent} />
      <div style={{ marginTop: "16px" }}>
        <Text strong>Content:</Text>
        <Text className="whitespace-pre-wrap">{content}</Text>
      </div>
    </Form>
  );
};

export default GenerateContent;
