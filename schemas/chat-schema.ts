import z from "zod";
import { userSchema } from "./user-schema";

export const messageSchema = z.object({
    id: z.number().optional(),
    type: z.string().default("text"),
    isRead: z.boolean().default(false),
    content: z.string().min(1, "Le contenu du message ne peut pas être vide"),
    
    sender: userSchema,
    conversation: z.any(), 
    
    createdAt: z.coerce.date().optional(),
});

export const conversationSchema = z.object({
    id: z.number(),
    user1: userSchema,
    user2: userSchema,
    messages: z.array(messageSchema),
    createdAt: z.date(),
})

export type Conversation = z.infer<typeof conversationSchema>


export type MessageType = z.infer<typeof messageSchema>