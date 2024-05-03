import type { WriteTransaction } from "replicache";

import type { CreateChat } from "@soulmate/validators";

async function createChat(tx: WriteTransaction, input: CreateChat) {
	const { chat } = input;
	await tx.set(chat.replicachePK, chat);
}

export { createChat };
