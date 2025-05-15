import {Request, Response} from "express"
import { Database } from "../../utils/database";
import { profilesTable } from "../../drizzle/schema/profiles";
import { eq } from "drizzle-orm";
import { z } from "zod";

const requestBodySchema = z.object({
  type: z.literal("user.deleted"),
  data: z.object({
    id: z.string(),
  })
});

export async function userDeletedHandler(req: Request, res: Response) {
  const {data: body, error: bodyError} = requestBodySchema.safeParse(JSON.parse(req.body.toString()));
  if (bodyError) {
    console.error(bodyError);
    res.status(400).json({status: "fail", error: "Invalid body!"});
    return;
  }

  await Database.queryDb(db => {
      return db.delete(profilesTable).where(eq(profilesTable.id, body.data.id));
  });

  res.status(200).json({
    status: "success"
  })
}