import type { WriteTransaction } from "replicache";

import type {
	Chat,
	CreateChat,
	CreateMessage,
	CreateSystemMessage,
} from "@soulmate/validators";
import { getEntityFromID } from "./util/get-id";

async function createChat(tx: WriteTransaction, input: CreateChat) {
	const { chat } = input;
	console.log("chat id", chat.id);
	const chatExist = (await tx.get(chat.replicachePK)) as Chat | undefined;
	console.log("chat exi", chatExist);

	if (chatExist) {
		console.info("Chat  alr exist");
		throw new Error("chat exist");
	}

	await tx.set(chat.replicachePK, chat);
}

async function createMessage(tx: WriteTransaction, input: CreateMessage) {
	const { message } = input;
	const chat = (await getEntityFromID(tx, message.chatID)) as Chat | undefined;

	if (!chat) {
		console.info("Chat  not found");
		throw new Error("Chat not found");
	}
	await tx.set(chat.replicachePK, {
		...chat,
		messages: chat.messages ? [...chat.messages, message] : [message],
	});
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
	await tx.set(chat.replicachePK, {
		...chat,
		systemMessages: chat.systemMessages
			? [...chat.systemMessages, message]
			: [message],
	});
}
async function clearChat(tx: WriteTransaction, input: { chatID: string }) {
	const { chatID } = input;
	const chat = (await getEntityFromID(tx, chatID)) as Chat | undefined;

	if (!chat) {
		console.info("Chat  not found");
		throw new Error("Chat not found");
	}
	await tx.set(chat.replicachePK, {
		...chat,
		systemMessages: [],
		messages: [],
	});
}

export { createChat, createSystemMessage, clearChat, createMessage };
