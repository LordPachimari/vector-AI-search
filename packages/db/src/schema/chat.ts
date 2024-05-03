import { integer, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const chats = pgTable(
	"users",
	{
		id: varchar("id").notNull().primaryKey(),
		chatter1ID: varchar("chatter1_id")
			.notNull()
			.references(() => users.id),
		chatter2ID: varchar("chatter2_id")
			.notNull()
			.references(() => users.id),
		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		version: integer("version").notNull(),
	},
	(chats) => ({
		chatter1Idx: uniqueIndex("chatter1_index").on(chats.chatter1ID),
		chatter2Idx: uniqueIndex("chatter2_index").on(chats.chatter2ID),
	}),
);

export const chatRelations = relations(chats, ({ many, one }) => ({
	chatter1: one(users, {
		fields: [chats.chatter1ID],
		references: [users.id],
	}),
	chatter2: one(users, {
		fields: [chats.chatter2ID],
		references: [users.id],
	}),
}));
