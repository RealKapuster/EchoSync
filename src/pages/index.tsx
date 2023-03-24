import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/components/layout/Header";
import {useAtom} from "jotai";
import { accountAtom, transcriptAtom } from '~/store';
import Transcribe from "~/components/Transcribe";
import Transcription from "~/components/Transcription";

const Home: NextPage = () => {
  const [account] = useAtom(accountAtom);
  const [transcript] = useAtom(transcriptAtom);

  return (
    <div className="bg-bgGray">
      <Head>
        <title>EchoSync</title>
        <meta name="description" content="transcribe your DAO meetings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <main className="container flex min-h-screen flex-col items-center py-12">
        {account ? 
          <div className="flex gap-8 flex-col">
            <Transcribe></Transcribe>
            {transcript && 
              <Transcription transcript={transcript}></Transcription>
            }
          </div> : 
          <h2>logged out</h2>
        }
      </main>
    </div>
  );
};

export default Home;
