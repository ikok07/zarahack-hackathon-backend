import { drizzle, NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { neonConfig, NeonQueryFunction, Pool } from "@neondatabase/serverless";

export class Database {

  private static schema = {};

  public static queryDb<T>(callback: (db: Omit<
    NeonDatabase<typeof this.schema> & { $client: NeonQueryFunction<false, false> },
    "_" | "$withAuth" | "batch" | "$with" | "$client"
  >) => Promise<T>) {
    neonConfig.webSocketConstructor = ws;

    const pool = new Pool({connectionString: process.env.DATABASE_URL!});
    const db = drizzle({
      client: pool
    });

    return callback(db);
  }

}