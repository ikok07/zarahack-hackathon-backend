import { Router } from "express";
import { askAiHandler } from "../../../handlers/ai/ask-ai.handler";
import { catchErrors } from "../../../utils/catch-errors";

const aiRoutes = Router();

aiRoutes.post("/ask", catchErrors(askAiHandler))

export default aiRoutes;