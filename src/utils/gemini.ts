import { GoogleGenAI } from "@google/genai";

export class Gemini {
  client = new GoogleGenAI({apiKey: process.env.GEMINI_KEY})

  async prompt() {

  }
}