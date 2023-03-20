import Upload from './ui/Upload';
import {Button, Form} from 'antd'; 
import { useState } from 'react';

import {UploadFile} from "antd/es/upload/interface";

const Transcribe = () => {
    const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);

    const updateUploadedFile = (file: UploadFile | null) => {
        setUploadedFile(file);
        console.log(file);
    }
    
    return (
        <div>
            <form >
                <Form.Item
                    className='flex pt-5 justify-end'
                    name="audio file"
                    rules={[{ required: true, message: 'Please upload a .mp3 file :)' }]}
                >
                    <Upload updateUploadedFile={updateUploadedFile}></Upload>
                </Form.Item>
                <Form.Item className='flex pt-5 justify-end'>
                    <Button className='' htmlType="submit" type={"primary"}>
                        Transcribe
                    </Button>
                </Form.Item>
            </form>
        </div>
    )
}

export default Transcribe