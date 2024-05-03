import { schema } from "@soulmate/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserInsertSchema = createInsertSchema(schema.users);
export const CreateUserSchema = z.object({
	user: UserInsertSchema,
});
export type CreateUser = z.infer<typeof CreateUserSchema>;
export const UserSchema = createSelectSchema(schema.users);
export type User = z.infer<typeof UserSchema>;
export const UpdateUserSchema = z.object({
	id: z.string(),
	updates: UserSchema.pick({
		avatarURL: true,
		about: true,
		hobbies: true,
		skills: true,
		uni: true,
	}),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
