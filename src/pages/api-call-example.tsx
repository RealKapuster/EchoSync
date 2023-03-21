import React, { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Button,
  Form,
  message,
  Radio,
  RadioChangeEvent,
  Spin,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { PromptType } from "./api/gpt";
import { ChatCompletionResponseMessage } from "openai";

const { Text } = Typography;

const ApiCallExample = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<PromptType>("Tweet");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) {
      const sizeLimit = 100 * 1024 * 1024; // 100 MB

      if (selectedFile.size > sizeLimit) {
        alert("File size exceeds 100 MB. Please choose a smaller file.");
        return;
      }
    }

    setFile(selectedFile || null);
  };

  const handleChooseFileClick = () => {
    inputFileRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    console.log(file.name);
    try {
      const response = await axios.post<{ text: string }>(
        "/api/transcribe",
        formData
      );
      console.log(response.data);
      setTranscription(response.data.text);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Internal Server Error";

      message.error(errorMessage);
      console.error(error);
    }

    setLoading(false);
  };
  const handleSubmitTranscription = async () => {
    setLoading(true);
    try {
      const response = await axios.post<ChatCompletionResponseMessage>(
        "/api/gpt",
        { text: transcription, promptType: promptType }
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

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        marginTop: "200px",
      }}
    >
      <Form onFinish={() => void handleSubmit()}>
        <Form.Item label="Select an audio file:">
          <input
            ref={inputFileRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button onClick={handleChooseFileClick} icon={<UploadOutlined />}>
            Choose File
          </Button>
          {file && <Text style={{ marginLeft: "8px" }}>{file.name}</Text>}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!file || loading}
            style={{ marginTop: "16px" }}
          >
            Transcribe
          </Button>
        </Form.Item>
      </Form>
      {loading && (
        <div style={{ marginTop: "16px" }}>
          <Spin size="large" />
          <Text style={{ marginLeft: "8px" }}>Loading...</Text>
        </div>
      )}
      {transcription && (
        <>
          <Form
            onFinish={() => void handleSubmitTranscription()}
            fields={[
              {
                name: ["promptType"],
                value: promptType,
              },
            ]}
          >
            <Form.Item>
              <div style={{ marginTop: "16px" }}>
                <Text strong>Transcription:</Text>
                <Text>{transcription}</Text>
              </div>
            </Form.Item>
            <Form.Item className="mb-0" name="promptType">
              <Radio.Group onChange={handlePromptTypeChange}>
                <Radio value="Tweet">Tweet</Radio>
                <Radio value="Blog">Blog</Radio>
                <Radio value="Newsletter">Newsletter</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item className="pt-0">
              <Button
                type="primary"
                htmlType="submit"
                disabled={!file || loading}
                style={{ marginTop: "16px" }}
              >
                Ask ChatGPT
              </Button>
            </Form.Item>
          </Form>
          {loading && (
            <div style={{ marginTop: "16px" }}>
              <Spin size="large" />
              <Text style={{ marginLeft: "8px" }}>Loading...</Text>
            </div>
          )}
        </>
      )}
      {content && (
        <div style={{ marginTop: "16px" }}>
          <Text strong>Content:</Text>
          <Text className="whitespace-pre-wrap">{content}</Text>
        </div>
      )}
    </div>
  );
};

export default ApiCallExample;
