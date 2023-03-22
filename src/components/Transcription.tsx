import { Button, Form, message, Upload } from "antd";
import Editor from "./ui/TextEditor";

const Transcription = ({transcript}: {transcript: string}) => {

    const storeTranscription = () => {
        console.log("storing..");
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mt-0 font-normal text-center">Your Transcription</h2>
        <Form onFinish={() => storeTranscription()}>
            <div className="flex flex-col">
                <Editor transcript={transcript} ></Editor>
            </div>
        </Form>
    </div>
    )
}

export default Transcription