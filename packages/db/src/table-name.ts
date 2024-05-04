import type { TableName } from ".";
import { users, chats, jsonTable, messages, systemMessages } from "./schema";

type UserTable = typeof users;
type MessageTable = typeof messages;
type ChatTable = typeof chats;
type SystemMessage = typeof systemMessages;
export type JsonTable = typeof jsonTable;
export type Table =
	| UserTable
	| JsonTable
	| MessageTable
	| ChatTable
	| SystemMessage;
export const tableNameToTableMap: Record<TableName, Table> = {
	users,
	json: jsonTable,
	messages,
	chats,
	systemMessages,
};
export type TableNameToTableMap = typeof tableNameToTableMap;
