import express, { Router } from "express";
import clerkRoutes from "./clerk.routes";
import bodyParser from "body-parser";

const webhooksRoutes = Router();

webhooksRoutes.use(bodyParser.raw({type: "application/json"}));

webhooksRoutes.use("/clerk", clerkRoutes);

export default webhooksRoutes;