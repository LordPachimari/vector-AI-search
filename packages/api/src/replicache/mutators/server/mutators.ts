import { updateUser } from "./user";
import { createChat } from "./chat";

const GlobalMutators = {
	updateUser,
};

export const GlobalMutatorsMap = new Map(Object.entries(GlobalMutators));
export type GlobalMutatorsType = typeof GlobalMutators;
export type GlobalMutatorsMapType = typeof GlobalMutatorsMap;

const ChatMutators = {
	createChat,
};

export const ChatMutatorsMap = new Map(Object.entries(ChatMutators));
export type ChatMutatorsType = typeof ChatMutators;
export type ChatMutatorsMapType = typeof ChatMutatorsMap;
