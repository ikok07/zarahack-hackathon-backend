import express, { Router } from "express";
import webhooksRoutes from "./webhooks/webhooks.routes";
import profilesRoutes from "./profiles/profiles.routes";
import aiRoutes from "./ai/ai.routes";

const v1Routes = Router();

v1Routes.use("/webhooks", webhooksRoutes);

v1Routes.use(express.json());

v1Routes.use("/profiles", profilesRoutes);
v1Routes.use("/ai", aiRoutes);

export default v1Routes;