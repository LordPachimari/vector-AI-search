export * as schema from "../src/schema";
import * as schema from "../src/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
export * from "./table-name";

const tableName = [
	"users",
	"chats",
	"json",
	"messages",
	"systemMessages",
] as const;

export const client = new Pool({ connectionString: "" });
export const db = drizzle(client, { schema });

export type TableName = (typeof tableName)[number];
export type Db = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
