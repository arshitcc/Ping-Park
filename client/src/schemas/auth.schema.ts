import z from "zod";

export const loginSchema = z.object({
    email: z.string().email().min(4),
    password: z.string().min(8),
});

export const signupSchema = z.object({
    name: z.string().min(4),
    email: z.string().email().min(4),
    password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;