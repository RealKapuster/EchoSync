import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/components/layout/Header";
import {useAtom} from "jotai";
import { accountAtom, transcriptAtom } from '~/store';
import Transcribe from "~/components/Transcribe";
import Transcription from "~/components/Transcription";
import LensBox from "~/components/LensBox";

const Home: NextPage = () => {
  const [account] = useAtom(accountAtom);
  const [transcript] = useAtom(transcriptAtom);

  return (
    <div className="bg-bgGray">
      <Head>
        <title>EchoSync</title>
        <meta name="description" content="transcribe your DAO meetings" />
        <link rel="icon" href="/ui/echosync-color.svg" />
      </Head>
      <Header></Header>
      <main className="container min-h-screen py-12 grid grid-cols-6 gap-8">
          {account ?
            <>
              <div className="flex flex-col col-span-2">
                <LensBox></LensBox>
              </div> 
              <div className="flex flex-col col-span-4">
                <div className="flex gap-8 flex-col items-center">
                  <Transcribe></Transcribe>
                  {transcript && 
                    <Transcription transcript={transcript}></Transcription>
                  }
                </div>
              </div>
            </>
            : 
            <h2>logged out</h2>
          }
      </main>
    </div>
  );
};

export default Home;
