import { Effect } from "effect";
// import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
// import { Redis } from "@upstash/redis";
import {
	type Chat,
	CreateChatSchema,
	CreateSystemMessageSchema,
	type SystemMessage,
} from "@soulmate/validators";

import { zod } from "../zod";
import { Database, TableMutator } from "../../context";
import { z } from "zod";

const createChat = zod(CreateChatSchema, (input) =>
	Effect.gen(function* (_) {
		const { chat } = input;
		const tableMutator = yield* _(TableMutator);

		return yield* _(tableMutator.set(chat, "chats"));
	}),
);

const createSystemMessage = zod(CreateSystemMessageSchema, (input) =>
	Effect.gen(function* () {
		const { message } = input;
		const tableMutator = yield* TableMutator;
		const { serverURL, userID } = yield* Database;

		const modifiedMessage: SystemMessage = {
			...message,
			loading: false,
		};

		const profileIDs = yield* Effect.tryPromise(() =>
			fetch(`${serverURL}/get-profiles`, {
				method: "POST",
				headers: {
					"Content-type": "text/plain",
					"x-user-id": userID,
				},
				body: message.question,
			}).then((data) => data.json() as Promise<(string | null)[]>),
		);
		console.log(">>>>>>", profileIDs);

		modifiedMessage.answer = profileIDs.filter((p) => p !== null) as string[];

		return yield* Effect.all(
			[
				tableMutator.set(modifiedMessage, "systemMessages"),
				tableMutator.update(message.chatID, {}, "chats"),
			],
			{ concurrency: 2 },
		);
	}),
);
const clearChat = zod(
	z.object({ chatID: z.string(), userID: z.string() }),
	(input) =>
		Effect.gen(function* () {
			const { chatID, userID } = input;

			const tableMutator = yield* TableMutator;
			yield* tableMutator.delete(chatID, "chats");
			const newChat: Chat = {
				id: `soulmate_chat_${userID}`,
				chatter1ID: userID,
				createdAt: new Date().toISOString(),
				replicachePK: `soulmate_chat_${userID}`,
				version: 0,
			};
			yield* tableMutator.set(newChat, "chats");
		}),
);

export { createChat, createSystemMessage, clearChat };
