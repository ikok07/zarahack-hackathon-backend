import {Request, Response} from "express"
import { Langgraph } from "../../utils/langgraph";
import { z } from "zod";
import { Gpt4o } from "../../utils/gpt4o";
import { VideoProcessor } from "../../utils/video-processor";

export const bodySchema = z.object({
    prompt: z.string(),
    thread_id: z.string()
})

export async function askAiHandler(req: Request, res: Response) {
    const {data: parsedBody, error} = bodySchema.safeParse(req.body);
    if (error) {
        res.status(400).json({error: "Invalid body!"});
        return;
    }
    const finalState = await Langgraph.invokeAgent(parsedBody.prompt, parsedBody.thread_id);

    res.status(200).json({
        status: "success",
        data: finalState.messages[finalState.messages.length - 1]
    });
}