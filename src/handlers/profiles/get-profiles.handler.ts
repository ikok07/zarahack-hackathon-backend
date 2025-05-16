import {Request, Response} from "express"
import { AppError } from "../../models/errors/app-error";
import { Database } from "../../utils/database";
import { profilesTable } from "../../drizzle/schema/profiles";
import { eq } from "drizzle-orm";

export async function getProfilesHandler(req: Request, res: Response) {
  const params = req.params;

  const userId = params.userId;
  if (!userId) throw new AppError(404, "User profile not found!");

  const profiles = await Database.queryDb(async db => {
    return (await db.select().from(profilesTable).where(eq(profilesTable.id, userId)));
  });
  if (profiles.length === 0) throw new AppError(404, "User profile not found!")

  res.status(200).json({
    status: "success",
    data: profiles[0]
  })
}