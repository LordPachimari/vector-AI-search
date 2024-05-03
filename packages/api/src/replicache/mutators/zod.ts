import type { Effect } from "effect";
import type { UnknownException } from "effect/Cause";
import type { z, ZodError } from "zod";

import type { NotFound } from "@soulmate/validators";
import type { Database, TableMutator } from "../context";

export function zod<Schema extends z.ZodSchema>(
	schema: Schema,
	func: (
		value: z.infer<Schema>,
	) => Effect.Effect<
		void,
		NotFound | ZodError | UnknownException,
		TableMutator | Database
	>,
) {
	const result = (input: z.infer<Schema>) => {
		const parsed = schema.parse(input);

		return func(parsed);
	};

	return result;
}
