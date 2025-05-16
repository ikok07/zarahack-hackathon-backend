import express, { Router } from "express";
import webhooksRoutes from "./webhooks/webhooks.routes";
import paymentsRoutes from "./payments/payments.routes";
import profilesRoutes from "./profiles/profiles.routes";

const v1Routes = Router();

v1Routes.use("/webhooks", webhooksRoutes);

v1Routes.use(express.json());

v1Routes.use("/profiles", profilesRoutes);
v1Routes.use("/payments", paymentsRoutes);

export default v1Routes;