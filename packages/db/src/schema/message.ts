import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	json,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";
import { chats } from "./chat";
import { users } from "./user";

export const messages = pgTable(
	"messages",
	{
		id: varchar("id").notNull().primaryKey(),
		text: varchar("text").notNull(),
		role: text("uni", { enum: ["user", "model"] as const }),
		senderID: text("sender_id")
			.notNull()
			.references(() => users.id),
		replicachePK: varchar("replicache_pk").notNull(),
		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		chatID: varchar("chat_id")
			.notNull()
			.references(() => chats.id, { onDelete: "cascade" }),
		version: integer("version").notNull(),
	},
	(messages) => ({
		chatIDIdx: index("chat_index").on(messages.chatID),
		senderID: index("sender_id").on(messages.senderID),
	}),
);

export const messageRelations = relations(messages, ({ many, one }) => ({
	chat: one(chats, {
		fields: [messages.chatID],
		references: [chats.id],
	}),
	senderID: one(users, {
		fields: [messages.senderID],
		references: [users.id],
	}),
}));

export const systemMessages = pgTable(
	"system_messages",
	{
		id: varchar("id").notNull().primaryKey(),
		question: varchar("question").notNull(),
		answer: json("answer").$type<string[] | string>(),
		replicachePK: varchar("replicache_pk"),
		loading: boolean("loading"),
		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		chatID: varchar("chat_id")
			.notNull()
			.references(() => chats.id, { onDelete: "cascade" }),
		version: integer("version").notNull(),
	},
	(messages) => ({
		chatIDIdx: index("chat_index1").on(messages.chatID),
	}),
);

export const systemMessageRelations = relations(systemMessages, ({ one }) => ({
	chat: one(chats, {
		fields: [systemMessages.chatID],
		references: [chats.id],
	}),
}));
