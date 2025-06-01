import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai"
import { z } from "zod";
import * as fs from "node:fs";

export const summarizeInformationSchema = z.object({
  information: z.string(),
  imageDescriptions: z.array(z.string())
});

export const translateResponseSchema = z.object({
  translatedContent: z.string().describe("Only the translated content")
});

export class Gpt4o {
    static model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_KEY!
  })

  static async summarizeInformation(topic: string, rawInformation: string) {
    console.log("GENERATING SUMMARIZED INFORMATION...");

    const prompt = ChatPromptTemplate.fromMessages([new SystemMessage(process.env.SUMMARIZE_INFORMATION_SYSTEM_PROMPT!), "Topic: {topic}, raw information: {rawInformation}"]);

    const response = await prompt
      .pipe(this.model.withStructuredOutput(summarizeInformationSchema))
      .invoke({
        topic, rawInformation
      });

    console.log("FINISHED GENERATING SUMMARIZED INFORMATION...");

    return response;
  }

  static async generatePresentationImages(imageDescriptions: string[], outputPath: string) {
      const openai = new OpenAI({apiKey: process.env.OPENAI_KEY!});
      const imagePaths: string[] = [];
      for (const description of imageDescriptions) {
        const { data } = await openai.images.generate({
          model: "gpt-image-1",
          prompt: description
        });
        const image_b64 = data ? data[0].b64_json : undefined;
        if (!image_b64) {
          console.error(`Failed to generate image! ${description}`);
          continue;
        }
        const image_bytes = Buffer.from(image_b64, "base64");
        fs.writeFileSync(outputPath, image_bytes);
        imagePaths.push(outputPath);
      }
      return imagePaths;
  }

  static async translateContent(content: string, language: string) {
      const prompt = ChatPromptTemplate.fromMessages([new SystemMessage(process.env.TRANSLATE_MODEL_SYSTEM_PROMPT!), "Content: {content}, Language: {language}"])
      return await prompt
        .pipe(this.model.withStructuredOutput(translateResponseSchema))
        .invoke({
          language,
          content
        });
  }

  static async extractDataFromUrl(url: string) {
      const prompt = ChatPromptTemplate.fromMessages([new SystemMessage(process.env.EXTRACT_DATA_SYSTEM_PROMPT!), "url: {url}"]);
      return (await prompt
        .pipe(this.model)
        .invoke({ url })).content;
  }
}