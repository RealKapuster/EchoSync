import { Dispatch, SetStateAction } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload as UploadAntd } from 'antd';

import {UploadFile} from "antd/es/upload/interface";

const { Dragger } = UploadAntd;

const Upload = ({updateUploadedFile} : {updateUploadedFile: (file: UploadFile | null) => void}) => {

  const uploadSettings: UploadProps = {
    name: 'audioFile',
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        updateUploadedFile(info.file)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        updateUploadedFile(null)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
      <Dragger {...uploadSettings} accept="audio/mp3" maxCount={1}>
          <p className="ant-upload-drag-icon">
              <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
          </p>
      </Dragger>
  )
}

export default Upload