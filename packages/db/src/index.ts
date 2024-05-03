export * from "drizzle-orm/sql";
export * as schema from "../src/schema";
import * as schema from "../src/schema";
export { alias } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
export * from "./table-name";

const tableName = ["user", "chat", "json", "message"];

export const client = new Pool();
export const db = drizzle(client, { schema });

export type TableName = (typeof tableName)[number];
export type Db = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
