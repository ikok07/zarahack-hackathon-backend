import { Router } from "express";
import v1Routes from "./v1/v1.routes";

const rootRouter = Router();

rootRouter.use("/api/v1", v1Routes)

export default rootRouter;