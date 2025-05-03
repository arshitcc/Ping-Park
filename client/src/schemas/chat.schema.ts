import { z } from "zod";

export const createNewChatSchema = z
  .object({
    isGroupChat: z.boolean(),
    chatName: z.string().optional(),
    participantIds: z.array(z.string()),
    groupPhoto: z
      .any()
      .optional()
      .refine((files) => {
        if (!files) return true;
        if (typeof FileList !== "undefined" && files instanceof FileList) return true;
        if (Array.isArray(files) && files.every((f) => f instanceof File)) return true;
        return false;
      }, { message: "Invalid file upload" }),
  })
  .superRefine((data, ctx) => {
    if (data.isGroupChat && (!data.chatName || data.chatName.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chatName"],
        message: "Chat name is required for group chats",
      });
    }
    if (data.participantIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["participantIds"],
        message: "You must select at least one participant",
      });
    }
  });

export type CreateNewChatSchema = z.infer<typeof createNewChatSchema>;
