import type { TableName } from ".";
import { users, chats, jsonTable, messages } from "./schema";

type UserTable = typeof users;
type MessageTable = typeof messages;
type ChatTable = typeof chats;

export type JsonTable = typeof jsonTable;
export type Table = UserTable | JsonTable | MessageTable | ChatTable;
export const tableNameToTableMap: Record<TableName, Table> = {
	users,
	json: jsonTable,
	messages,
	chats,
};
export type TableNameToTableMap = typeof tableNameToTableMap;
