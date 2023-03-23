import { Polybase } from "@polybase/client";
import Wallet from "ethereumjs-wallet";
import { ethPersonalSign } from "@polybase/eth";

const schema = `
@public
collection User {
  id: string; 
  publicKey: PublicKey;
  transcripts: map<string, Transcript>;

  constructor (id: string) {
    this.id = id;
    this.publicKey = ctx.publicKey;
    // this.transcripts = {};
  }

  function setTranscript (transcript: Transcript) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.transcripts[transcript.id] = transcript;
  }
}

@public
collection Transcript {
  id: string;
  publicKey: PublicKey;
  contents: map<string, string>;

  constructor (id: string, followee: string) {
    this.id = id;
    this.publicKey = ctx.publicKey;
    // this.contents = {};
  }
  function setContent (content: string, type: string) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.contents[type] = content;
  }
}

`;

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

async function load() {
  const db = new Polybase({
    defaultNamespace:
      "pk/0xfa395893b22933e9b0279bdfcfa9dceaa377b85a1bea3d29b053c61fb5a3b3b6daa1526c8d4bccf532cd9a652287c43f2cf209f0f7b7cb0b8b5e8544234f23f8/EchoSync",
    signer: async (data) => {
      const wallet = Wallet.fromPrivateKey(Buffer.from(PRIVATE_KEY, "hex"));
      return {
        h: "eth-personal-sign",
        sig: ethPersonalSign(wallet.getPrivateKey(), data),
      };
    },
  });

  if (!PRIVATE_KEY) {
    throw new Error("No private key provided");
  }

  await db.applySchema(schema);

  return "Schema loaded";
}

load().then(console.log).catch(console.error);
