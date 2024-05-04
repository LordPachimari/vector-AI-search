import type { WriteTransaction } from "replicache";

import type { Server } from "..";
import { updateUser } from "./user";
import {
	clearChat,
	createChat,
	createMessage,
	createSystemMessage,
} from "./chat";

export type GlobalMutatorsType = {
	[key in keyof Server.GlobalMutatorsType]: (
		tx: WriteTransaction,
		args: Parameters<Server.GlobalMutatorsType[key]>[0],
	) => Promise<void>;
};
export const GlobalMutators: GlobalMutatorsType = {
	updateUser,
};

export type ChatMutatorsType = {
	[key in keyof Server.ChatMutatorsType]: (
		tx: WriteTransaction,
		args: Parameters<Server.ChatMutatorsType[key]>[0],
	) => Promise<void>;
};
export const ChatMutators: ChatMutatorsType = {
	createChat,
	createSystemMessage,
	createMessage,
	clearChat,
};
