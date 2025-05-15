import {z} from "zod";
import "dotenv/config"

const configSchema = z.object({
    port: z.string(),
    env: z.enum(["production", "development"])
});

type Config = z.infer<typeof configSchema>;

const {data: serverConfig, error} = configSchema.safeParse({
    port: process.env.PORT!,
    env: process.env.NODE_ENV!
});

if (error) throw new Error("Invalid configuration!");

export default serverConfig;