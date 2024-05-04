import type { WriteTransaction } from "replicache";

import type {
	Chat,
	CreateChat,
	CreateSystemMessage,
} from "@soulmate/validators";
import { getEntityFromID } from "./util/get-id";

async function createChat(tx: WriteTransaction, input: CreateChat) {
	const { chat } = input;
	await tx.set(chat.replicachePK, chat);
}

async function createSystemMessage(
	tx: WriteTransaction,
	input: CreateSystemMessage,
) {
	const { message } = input;
	const chat = (await getEntityFromID(tx, message.chatID)) as Chat | undefined;

	if (!chat) {
		console.info("Chat  not found");
		throw new Error("Chat not found");
	}
	console.log(
		"yo",
		chat.systemMessages ? [...chat.systemMessages, message] : [message],
	);
	await tx.set(chat.replicachePK, {
		...chat,
		systemMessages: chat.systemMessages
			? [...chat.systemMessages, message]
			: [message],
	});
}
async function clearChat(
	tx: WriteTransaction,
	input: { chatID: string; userID: string },
) {
	const { chatID } = input;
	const chat = (await getEntityFromID(tx, chatID)) as Chat | undefined;

	if (!chat) {
		console.info("Chat  not found");
		throw new Error("Chat not found");
	}
	await tx.set(chat.replicachePK, {
		...chat,
		messages: [],
	});
}

export { createChat, createSystemMessage, clearChat };
