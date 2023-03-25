import { Button, Form } from "antd";
import { useState } from "react";
import Editor from "./ui/TextEditor";
import { Polybase } from "@polybase/client";
import * as eth from "@polybase/eth";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import GenerateContent from "./GenerateContent";

const db = new Polybase({
  defaultNamespace:
    "pk/0x1d2135df019946bf1eb9a93daf5ffc4d880eccbd58c555859cee0f7f914031bd709575fec122a1ddcc3139011e6896f174f017cd208f0f0a436474b9c8490d07/Echosync",
});
const collectionReference = db.collection("Transcription");

// Add signer fn
db.signer(async (data: string) => {
  // A permission dialog will be presented to the user
  const accounts = await eth.requestAccounts();
  const account = accounts[0];

  if (account) {
    const sig = await eth.sign(data, account);
    return { h: "eth-personal-sign", sig };
  } else {
    console.log("no account found");
    return null;
  }
});

const Transcription = ({ transcript }: { transcript: string }) => {
  const [isError, setIsError] = useState(false);

  const storeTranscription = async () => {
    console.log("storing..");
    try {
      const recordData = await collectionReference.create([
        uuidv4(),
        "Transcript1",
        transcript,
      ]);

      console.log(recordData);
    } catch (err) {
      console.log(err);
      console.log("error");
      setIsError(true);
    }

    if (!isError) {
      message.success(`Text uploaded successfully.`);
    } else {
      message.error("Something went wrong with the upload. Please try again.");
    }
  };

  return (
    <div className="w-full rounded-lg bg-white shadow-md">
      <div className="p-6">
        <h2 className="mt-0 font-normal">Your Transcription</h2>
        <Form onFinish={() => storeTranscription()}>
          <div className="flex flex-col">
            <Editor transcript={transcript}></Editor>
          </div>
        </Form>
        <div className="flex justify-end">
          <Button
            type="primary"
            className="text-md border-1 mt-6 h-auto rounded-full border-btnColour bg-btnColour py-[10px]
                    px-6 font-bold hover:!border-solid hover:!bg-transparent hover:!text-btnColour"
            onClick={storeTranscription}
          >
            Store on Polybase
          </Button>
        </div>
        <GenerateContent transcript={transcript} />
      </div>
    </div>
  );
};

export default Transcription;
