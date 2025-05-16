import express, { Router } from "express";
import webhooksRoutes from "./webhooks/webhooks.routes";
import paymentsRoutes from "./payments/payments.routes";

const v1Routes = Router();

v1Routes.use("/webhooks", webhooksRoutes);
v1Routes.use("/payments", paymentsRoutes);

v1Routes.use(express.json());

export default v1Routes;