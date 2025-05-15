import { Router } from "express";
import { userCreatedHandler } from "../../../handlers/auth/user-created.handler";
import { clerkMiddleware } from "../../../middleware/webhooks/clerk/clerk.middleware";
import { catchErrors } from "../../../utils/catch-errors";
import { userDeletedHandler } from "../../../handlers/auth/user-deleted.handler";

const clerkRoutes = Router();

clerkRoutes.post("/user/created", clerkMiddleware(process.env.USER_CREATED_SECRET!), catchErrors(userCreatedHandler));
clerkRoutes.post("/user/deleted", clerkMiddleware(process.env.USER_DELETED_SECRET!), catchErrors(userDeletedHandler));

export default clerkRoutes;