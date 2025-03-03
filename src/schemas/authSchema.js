import { z } from "zod";

const authSchema = z.object({
  user: z.string(),
  password: z.string(),
});

export default authSchema;
