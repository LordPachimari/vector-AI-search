import { Effect } from "effect";

import { CreateUserSchema, UpdateUserSchema } from "@soulmate/validators";

import { zod } from "../zod";
import { TableMutator } from "../../context";

const createUser = zod(CreateUserSchema, (input) =>
	Effect.gen(function* (_) {
		const { user } = input;
		const tableMutator = yield* _(TableMutator);

		return yield* _(tableMutator.set(user, "users"));
	}),
);
const updateUser = zod(UpdateUserSchema, (input) =>
	Effect.gen(function* (_) {
		const { updates, id } = input;

		yield* Effect.log("are you up there");
		const tableMutator = yield* _(TableMutator);

		return yield* _(tableMutator.update(id, { ...updates }, "users"));
	}),
);

export { updateUser, createUser };
