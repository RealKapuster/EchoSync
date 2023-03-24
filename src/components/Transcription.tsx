import { Button, Form } from "antd";
import { useState } from "react";
import Editor from "./ui/TextEditor";
import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth"
import { message } from "antd";
import { v4 as uuidv4 } from 'uuid';

const db = new Polybase({
  defaultNamespace: "pk/0x1d2135df019946bf1eb9a93daf5ffc4d880eccbd58c555859cee0f7f914031bd709575fec122a1ddcc3139011e6896f174f017cd208f0f0a436474b9c8490d07/Echosync",
});
const collectionReference = db.collection("Transcription");

// Add signer fn
db.signer(async (data: string) => {
    // A permission dialog will be presented to the user
    const accounts = await eth.requestAccounts();
    const account = accounts[0];

    if(account){
        const sig = await eth.sign(data, account);
        return { h: "eth-personal-sign", sig };
    }else{
        console.log("no account found");
        return null;
    }

})

const Transcription = ({transcript}: {transcript: string}) => {
    const [isError, setIsError] = useState(false)

    const storeTranscription = async () => {
        console.log("storing..");
        try{
            const recordData = await collectionReference.create([
                uuidv4(),
                "Transcript1", 
                transcript
            ]);
    
            console.log(recordData);
        }catch(err){
            console.log(err);
            setIsError(true)
        }

        if(isError){
            message.success(`Text uploaded successfully.`);
        }else{
            message.error("Something went wrong with the upload. Please try again.");
        }
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mt-0 font-normal text-center">Your Transcription</h2>
        <Form onFinish={() => storeTranscription()}>
            <div className="flex flex-col">
                <Editor transcript={transcript} ></Editor>
            </div>
        </Form>
        <div className="flex justify-end">
            <Button type="primary" className="mt-4 bg-green bg-btnColour rounded-full font-bold text-md py-[10px] px-6 h-auto
                hover:!bg-transparent hover:!text-btnColour hover:!border-solid border-btnColour border-1" 
                onClick={storeTranscription}>
                    Store on Polybase
            </Button>
        </div>
    </div>
    )
}

export default Transcription