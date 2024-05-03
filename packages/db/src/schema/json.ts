import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const jsonTable = pgTable("json", {
	id: varchar("id").notNull().primaryKey(),
	replicachePK: varchar("replicache_pk"),
	value: json("value").notNull().$type<Record<string, unknown>>(),
	version: integer("version").notNull(),
});
