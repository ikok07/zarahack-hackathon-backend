import { tool } from "@langchain/core/tools";
import { Gpt4o } from "./gpt4o";
import { z } from "zod";
import { ElevenLabs } from "./elevenlabs";
import { fetchUserPreferences } from "./user-preferences";
import axios from "axios";
import path from "path";
import { VideoProcessor } from "./video-processor";

export const getUserPreferences = tool(() => {
  console.log("GETTING USER PREFERENCES...");
  const res = fetchUserPreferences();
  console.log("FINISHED GETTING USER PREFERENCES");
  return res;
}, {
  name: "get_user_preferences",
  description: "Gets the current user preferences, which should be used for further tool choosing.",
});

export const researchResources = tool(async ({topic}) => {
  try {
    console.log("TRANSLATING TOPIC...");
    const {translatedContent: translatedTopic} = await Gpt4o.translateContent(topic, "english");

    console.log(`RESEARCHING TOPIC ${translatedTopic}...`);
    const {data} = await axios.get<[
      searchTerm: string,
      resultTitles: string[],
      resultDescriptions: string[],
      resultUrls: string[]
    ]>(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURI(translatedTopic)}&limit=1&namespace=0&format=json`);

    const information = await Gpt4o.extractDataFromUrl(data[3][0]);
    console.log(information);
    console.log("FINISHED RESEARCHING TOPIC");
    return {
      topic,
      information: information.toString()
    }
  } catch (e) {
    console.log(e);
    return {
      error: "An error occurred!"
    }
  }
}, {
  name: "research_resources",
  description: "Researches information about the provided topic",
  schema: z.object({
    topic: z.string()
  })
});

export const generateScripts = tool(async ({topic, information}) => {
  const { information: script, imageDescriptions } = await Gpt4o.summarizeInformation(
    topic,
    information
  );
  return { script, imageDescriptions };
},{
  name: "generate_script",
  description: "Generate script",
  schema: z.object({
    topic: z.string(),
    information: z.string()
  })
});

export const generateAudio = tool(async ({rawScript}) => {
  return await ElevenLabs.generateAudio(rawScript);
}, {
  name: "generate_audio",
  description: "Generate the audio for the presentation",
  schema: z.object({
    rawScript: z.string()
  })
})

export const generatePresentationImages = tool(async ({imageDescriptions}) => {
  console.log("GENERATING PRESENTATION IMAGES...");
  const imagesPath = path.join(process.env.ASSETS_ROOT!, "images", Date.now().toString());
  await Gpt4o.generatePresentationImages(imageDescriptions, imagesPath);
  console.log("FINISHED GENERATING PRESENTATION IMAGES!");
  return {
    imagesFolder: imagesPath
  }
}, {
  name: "generate_presentation_images",
  description: "Generates the images for the presentation based on received description",
  schema: z.object({imageDescriptions: z.array(z.string())})
});

export const generatePresentationVideo = tool(async ({imagesPath, audioPath}) => {
  console.log("GENERATING PRESENTATION VIDEO...");
  const outputPath = path.join(process.env.ASSETS_ROOT!, "video", `${Date.now()}.mp4`);
  const processor = new VideoProcessor();
  await processor.combineImagesWithAudio(imagesPath, audioPath, outputPath);
  console.log("FINISHED GENERATING PRESENTATION VIDEO!");
  return {
    videoPath: outputPath
  }
}, {
  name: "generate_presentation_video",
  description: "Generate presentation video with the previously generated images and audio",
  schema: z.object({
    imagesPath: z.string(),
    audioPath: z.string()
  })
})