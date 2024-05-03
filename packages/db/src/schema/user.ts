import {
	integer,
	pgTable,
	text,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

const uni = [
	"uni_melb",
	"swinburne",
	"monash",
	"rmit",
	"deakin",
	"victoria",
	"la_trobe",
] as const;
export const users = pgTable(
	"users",
	{
		id: varchar("id").notNull().primaryKey(),
		replicachePK: varchar("replicache_pk").notNull(),
		username: varchar("username").notNull(),
		fullName: varchar("fullName"),
		about: text("about"),
		skills: varchar("skills"),
		hobby: varchar("hobby"),
		uni: text("uni", { enum: uni }).notNull().default("monash"),
		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		version: integer("version").notNull(),
	},
	(users) => ({
		usernameIndex: uniqueIndex("username_index").on(users.username),
	}),
);
