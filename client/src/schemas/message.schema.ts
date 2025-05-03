import z from "zod";

const newMessageSchema = z.object({
  message: z.string(),
  captions: z.array(z.string()),
  files: z.array(z.any()),
});

export type NewMessageSchema = z.infer<typeof newMessageSchema>;
