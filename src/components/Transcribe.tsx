import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, message, Upload } from "antd";
import { useState } from "react";
import axios from "axios";

import { RcFile } from "antd/es/upload";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

const Transcribe = () => {
  const [uploadedFile, setUploadedFile] = useState<RcFile | undefined>(
    undefined
  );
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sizeLimit = 100 * 1024 * 1024; // 100 MB

  const submitAudioFile = async () => {
    console.log("Submit");
    if (!uploadedFile) {
      console.error("No file selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post<{ text: string }>(
        "/api/transcribe",
        formData
      );
      console.log(response.data);
      setTranscript(response.data.text);
      console.log(response.data.text);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Internal Server Error";
      message.error(errorMessage);
      console.error(error);
    }

    setLoading(false);
  };

  const uploadSettings: UploadProps = {
    name: "audioFile",
    multiple: false,
    beforeUpload: (file) => {
      console.log(file);
      setUploadedFile(file);
      return false;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mt-0 font-normal">Transcribe Audio</h2>
      <Form onFinish={() => submitAudioFile()}>
        <div className="flex flex-col">
          <Form.Item className="">
            <Dragger
              {...uploadSettings}
              accept="audio/wav, audio/mpeg, audio/m4a"
              maxCount={1}
            >
              <div className="p-4">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </div>
            </Dragger>
          </Form.Item>
          <Form.Item className="flex justify-end pt-3">
            <Button
              className=""
              htmlType="submit"
              type={"primary"}
              disabled={!uploadedFile || loading}
            >
              Transcribe
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default Transcribe;
