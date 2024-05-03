import { Effect } from "effect";
import type { UnknownException } from "effect/Cause";

export const UnknownExceptionLogger = (e: UnknownException, title: string) => {
	Effect.logError(`${title} error: ${e.message}`);

	return new Error(`${title} error: ${e.message}`);
};
