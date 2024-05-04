import { updateUser } from "./user";
import {
	clearChat,
	createChat,
	createMessage,
	createSystemMessage,
} from "./chat";

const GlobalMutators = {
	updateUser,
};

export const GlobalMutatorsMap = new Map(Object.entries(GlobalMutators));
export type GlobalMutatorsType = typeof GlobalMutators;
export type GlobalMutatorsMapType = typeof GlobalMutatorsMap;

const ChatMutators = {
	createChat,
	createSystemMessage,
	createMessage,
	clearChat,
};

export const ChatMutatorsMap = new Map(Object.entries(ChatMutators));
export type ChatMutatorsType = typeof ChatMutators;
export type ChatMutatorsMapType = typeof ChatMutatorsMap;
