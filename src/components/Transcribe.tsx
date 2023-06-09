import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, message, Upload } from "antd";
import { useState } from "react";
import axios from "axios";
import {useAtom} from "jotai";
import {updateTranscriptAtom } from '~/store';
import { RcFile } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

import type { UploadProps } from "antd";

const { Dragger } = Upload;
const sizeLimit = 1024 * 1024 * 10; // 10 MB in bytes;

const Transcribe = () => {
  const [loading, setLoading] = useState(false);
  const [ ,updateTranscript] = useAtom(updateTranscriptAtom);
  const [uploadedFile, setUploadedFile] = useState<RcFile | undefined>(
    undefined
  );

  const submitAudioFile = async () => {
    console.log("Submit");
    
    if (!uploadedFile) {
      console.error("No file selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("mock", "true");
    try {
      const response = await axios.post<{ text: string }>(
        "/api/transcribe",
        // "/api/fakeTranscribe", //another fake api route
        formData
      );
      updateTranscript(response.data.text);
    } catch (error: any) {
      const errorMessage =
      error.response?.data?.error || "Internal Server Error";
      message.error(errorMessage);
      console.error(error);
      updateTranscript(null);
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

    onRemove() {
      console.log("removed file");
      setUploadedFile(undefined);
    },
  };

  // Gets rid of the automatic file upload
  const dummyRequest = ({file, onSuccess}: RcCustomRequestOptions<any>) => {
    setTimeout(()=> {
      onSuccess && onSuccess(`${file} file uploaded successfully.`);
    }, 0)
  }

  return (
    <div className="rounded-lg bg-white shadow-md w-full">
      <div className='p-6'>
        <h2 className="mt-0 font-normal">Upload Your Audio</h2>
        <Form onFinish={() => submitAudioFile()}>
          <div className="flex flex-col">
            <Form.Item className="">
              <Dragger
                {...uploadSettings}
                customRequest={dummyRequest}
                accept="audio/wav, audio/mpeg, audio/m4a"
                maxCount={1}
              >
                <div className="p-4">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text !text-lg">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint !text-lg">
                    Support for a single or bulk upload. Strictly prohibited from
                    uploading company data or other banned files.
                  </p>
                </div>
              </Dragger>
            </Form.Item>
            {uploadedFile !== undefined && 
              <Form.Item className="flex justify-end mb-0">
                <Button
                  className="bg-btnColour rounded-full font-bold text-md py-[10px] px-6 h-auto 
                    hover:!bg-transparent hover:!text-btnColour hover:!border-solid disabled:!text-slate-200 border-btnColour border-1"
                  htmlType="submit"
                  type={"primary"}
                  disabled={loading}
                >
                  Transcribe
                </Button>
            </Form.Item>}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Transcribe;
