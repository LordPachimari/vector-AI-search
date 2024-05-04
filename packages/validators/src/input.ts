import { schema } from "@soulmate/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserInsertSchema = createInsertSchema(schema.users);
export const ChatInsertSchema = createInsertSchema(schema.chats);
export const CreateUserSchema = z.object({
	user: UserInsertSchema,
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export type CreateChat = z.infer<typeof CreateChatSchema>;
export const UserSchema = createSelectSchema(schema.users).extend({
	hobbies:z.array(z.string()).optional(),

	skills:z.array(z.string()).optional(),
});
export type User = z.infer<typeof UserSchema>;
export const UpdateUserSchema = z.object({
	id: z.string(),
	updates: UserSchema.partial().pick({
		fullName: true,
		avatarURL: true,
		about: true,
		hobbies: true,
		skills: true,
		uni: true,
	}),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export const CreateChatSchema = z.object({
	chat: ChatInsertSchema,
});
