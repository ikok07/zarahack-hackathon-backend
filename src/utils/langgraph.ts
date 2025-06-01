import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  generateAudio,
  generatePresentationImages, generatePresentationVideo,
  generateScripts,
  getUserPreferences,
  researchResources,
} from "./agent-tools";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class Langgraph {
  static agent = createReactAgent({
    llm: new ChatOpenAI({model: "gpt-4o", apiKey: process.env.OPENAI_KEY!, temperature: 0}),
    tools: [getUserPreferences, researchResources, generateScripts, generateAudio, generatePresentationImages],
    checkpointSaver: new MemorySaver()
  });

  static async invokeAgent(prompt: string, thread_id?: string) {
    try {
      return await this.agent.invoke({
        messages: [
          new SystemMessage(process.env.AGENT_SYSTEM_PROMPT!),
          new HumanMessage(prompt)
        ],
      }, {
        configurable: { thread_id: `${thread_id ?? Math.random() * Math.PI * Date.now()}` }
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}