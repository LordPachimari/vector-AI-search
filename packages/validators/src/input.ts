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
	hobbies: z.array(z.string()).optional(),

	skills: z.array(z.string()).optional(),
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
		twitterAuth: true,
	}),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export const CreateChatSchema = z.object({
	chat: ChatInsertSchema,
});
export const SystemMessageSchema = createInsertSchema(
	schema.systemMessages,
).extend({
	answer: z.string().or(z.array(z.string())).optional(),
});
export const CreateSystemMessageSchema = z.object({
	message: SystemMessageSchema,
	isProfileFinder: z.boolean(),
	targetUserID: z.string().optional(),
});
export type SystemMessage = z.infer<typeof SystemMessageSchema>;
export type CreateSystemMessage = z.infer<typeof CreateSystemMessageSchema>;
export const MessageSchema = createInsertSchema(schema.messages);
export type Message = z.infer<typeof MessageSchema>;

export const CreateMessageSchema = z.object({
	message: MessageSchema,
});
export type CreateMessage = z.infer<typeof CreateMessageSchema>;
export const ChatSchema = createInsertSchema(schema.chats).extend({
	messages: z.array(MessageSchema).optional(),
	systemMessages: z.array(SystemMessageSchema).optional(),
	chatter1: UserSchema.optional(),
	chatter2: UserSchema.optional(),
});
export type Chat = z.infer<typeof ChatSchema>;
