import express from "express";
import serverConfig from "./config/config";
import rootRouter from "./routes/index.routes";

const app = express();

app.use(rootRouter);

app.listen(serverConfig?.port, () => {
    console.log(`Server running on port: ${serverConfig?.port}`);
});