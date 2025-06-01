// MOCK
import { z } from "zod";

export const userPreferencesSchema = z.object({
  age: z.number().min(7),
  learningStyle: z.enum(["visual", "auditory", "reading"])
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export async function fetchUserPreferences(): Promise<UserPreferences> {
  return {
    age: 20,
    learningStyle: "auditory"
  }
}