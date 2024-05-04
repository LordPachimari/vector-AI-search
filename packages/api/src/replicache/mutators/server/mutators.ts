import { updateUser } from "./user";
import { createChat, createSystemMessage } from "./chat";

const GlobalMutators = {
	updateUser,
};

export const GlobalMutatorsMap = new Map(Object.entries(GlobalMutators));
export type GlobalMutatorsType = typeof GlobalMutators;
export type GlobalMutatorsMapType = typeof GlobalMutatorsMap;

const ChatMutators = {
	createChat,
	createSystemMessage,
};

export const ChatMutatorsMap = new Map(Object.entries(ChatMutators));
export type ChatMutatorsType = typeof ChatMutators;
export type ChatMutatorsMapType = typeof ChatMutatorsMap;
