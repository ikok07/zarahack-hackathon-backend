import { ElevenLabsClient } from "elevenlabs";
import * as fs from "node:fs";
import path from "path"
import { pipeline } from "stream/promises";

export class ElevenLabs {
  static client = new ElevenLabsClient({
    apiKey: process.env.ELEVEN_LABS!
  });

  static async generateAudio(text: string) {
      console.log("GENERATING AUDIO...");
      const audio = await this.client.textToSpeech.convert("M1ydWt7KnBCiuv4CnEDC", {
        text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128"
      });
      console.log("AUDIO:", audio);
      const audioPath = path.join(`${process.env.ASSETS_ROOT!}/audio`, `${Date.now()}.mp3`);
      const writeStream = fs.createWriteStream(audioPath);

      await pipeline(audio, writeStream);
      console.log("AUDIO GENERATED");
      return audioPath;
  }
}