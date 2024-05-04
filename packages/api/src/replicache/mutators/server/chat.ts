import { Effect } from "effect";

import { CreateChatSchema } from "@soulmate/validators";

import { zod } from "../zod";
import { TableMutator } from "../../context";

const createChat = zod(CreateChatSchema, (input) =>
	Effect.gen(function* (_) {
		const { chat } = input;
		const tableMutator = yield* _(TableMutator);

		return yield* _(tableMutator.set(chat, "chats"));
	}),
);

export { createChat };
