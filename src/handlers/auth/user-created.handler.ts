import {Request, Response} from "express"
import { z } from "zod";
import axios from "axios";
import { Database } from "../../utils/database";
import { profilesTable } from "../../drizzle/schema/profiles";

const requestBodySchema = z.object({
  type: z.literal("user.created"),
  data: z.object({
    id: z.string(),
    email_addresses: z.array(z.object({
      email_address: z.string().email(),
    })),
    phone_numbers: z.array(z.object({
      phone_number: z.string()
    })),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    image_url: z.string().url().nullable()
  })
});

export async function userCreatedHandler(req: Request, res: Response) {
  const {data: body, error: bodyError} = requestBodySchema.safeParse(JSON.parse(req.body.toString()));
  if (bodyError) {
    console.error(bodyError);
    res.status(400).json({status: "fail", error: "Invalid body!"});
    return;
  }

  await axios.patch(`https://api.clerk.com/v1/users/${body.data.id}/metadata`, {
    public_metadata: {
      roles: ["user"],
    }
  }, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
    }
  });

  await Database.queryDb(db => {
    return db.insert(profilesTable).values({
      id: body.data.id,
      name: `${body.data.first_name} ${body.data.last_name}`,
      email: body.data.email_addresses[0].email_address,
      phone: body.data.phone_numbers[0].phone_number,
      image_url: body.data.image_url
    });
  });

  res.status(200).json({
    status: "success"
  })
}