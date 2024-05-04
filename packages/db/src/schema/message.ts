import { integer, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { chats } from "./chat";

export const messages = pgTable(
	"messages",
	{
		id: varchar("id").notNull().primaryKey(),
		text: varchar("text").notNull(),
		replicachePK: varchar("replicache_pk").notNull(),
		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		chatID: varchar("chat_id")
			.notNull()
			.references(() => chats.id),
		version: integer("version").notNull(),
	},
	(messages) => ({
		chatIDIdx: uniqueIndex("chat_index").on(messages.chatID),
	}),
);

export const messageRelations = relations(messages, ({ many, one }) => ({
	chat: one(chats, {
		fields: [messages.chatID],
		references: [chats.id],
	}),
}));
