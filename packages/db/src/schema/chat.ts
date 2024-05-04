import { index, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { messages, systemMessages } from "./message";

export const chats = pgTable(
	"chats",
	{
		id: varchar("id").notNull().primaryKey(),
		replicachePK: varchar("replicache_pk").notNull(),
		chatter1ID: varchar("chatter1_id")
			.notNull()
			.references(() => users.id),
		chatter2ID: varchar("chatter2_id").references(() => users.id),

		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		version: integer("version").notNull(),
	},
	(chats) => ({
		chatter1Idx: index("chatter1_index").on(chats.chatter1ID),
		chatter2Idx: index("chatter2_index").on(chats.chatter2ID),
	}),
);

export const chatRelations = relations(chats, ({ many, one }) => ({
	messages: many(messages),
	systemMessages: many(systemMessages),
}));
