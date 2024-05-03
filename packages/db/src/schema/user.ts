import {
	integer,
	json,
	pgTable,
	text,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

const uni = [
	"Monash",
	"University of melbourne",
	"Swinburne",
	"RMIT",
	"Deakin",
	"Victoria",
	"La Trobe",
	"Tate University",
	"Harvard",
	"MIT",
	"Stanford",
] as const;
export const users = pgTable(
	"users",
	{
		id: varchar("id").notNull().primaryKey(),
		replicachePK: varchar("replicache_pk").notNull(),
		username: varchar("username").notNull(),
		fullName: varchar("fullName"),
		avatarURL: varchar("avatar_url"),
		about: text("about"),
		skills: json("skills").$type<string[]>(),
		hobbies: json("hobbies").$type<string[]>(),
		uni: text("uni", { enum: uni }).notNull().default("Monash"),
		createdAt: varchar("created_at").notNull(),
		updatedAt: varchar("updated_at").$onUpdate(() => new Date().toISOString()),
		version: integer("version").notNull(),
	},
	(users) => ({
		usernameIndex: uniqueIndex("username_index").on(users.username),
	}),
);
