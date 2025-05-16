import { Router } from "express";
import { getProfilesHandler } from "../../../handlers/profiles/get-profiles.handler";
import { catchErrors } from "../../../utils/catch-errors";

const profilesRoutes = Router();

profilesRoutes.get("/:userId", catchErrors(getProfilesHandler));

export default profilesRoutes;