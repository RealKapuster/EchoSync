import nextConnect from "next-connect";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Extend the NextApiRequest type to include the 'file' property
interface ExtendedNextApiRequest extends NextApiRequest {
  file: any;
}

const upload = multer();
const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file received" });
    }

    const formData = new FormData();

    formData.append("file", file.buffer, { filename: file.originalname });
    formData.append("model", "whisper-1");

    res.status(200).json({text: `:studio_microphone::headphones: NEW PODCAST ALERT :headphones::studio_microphone:
    Discover the mysterious world of #GoblinTown, a unique #NFT project shaking the foundations of what's expected in the #Web3 space! Join us as we dive into the grotesque art, intriguing narrative & innovative storytelling of this captivating project.
    :male_mage::speech_balloon: Goblin Town has created an authentic experience by engaging with the community through Twitter and its own language, Gobloney. Explore how this project connects to Joseph Campbell's classic hero's journey and the fascination with goblin-themed NFTs!
    :art::mag_right: From mysterious languages to Creative Commons Zero licensing and hidden Easter eggs in smart contracts, we discuss the unique aspects of this project. Learn how Goblin Town expanded its universe by allowing users to create their own character-defining burgers!
    :hamburger::city_sunrise: Goblin NFTs took over NFT NYC with a roaming McGoblin burger truck and a chaotic, goblin-themed party. We delve into the real-time narrative storytelling that created an immersive experience, cementing the goblin NFTs' place within the Web3 ecosystem.
    :busts_in_silhouette::earth_africa: As the community grows, we discuss the importance of world-building and the interactive experience of being part of this unfolding story. In Goblin Town, every one of us can be heroes as we collectively answer the questions that arise in these stories.
    :link::ear: Don't miss this exciting podcast! Tune in now to uncover the secrets of Goblin Town and the future of tokenized stories in the Web3 community. #Podcast #NFTCommunity #GoblinNFT`});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "1mb",
  },
};