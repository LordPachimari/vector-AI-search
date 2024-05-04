import type { Effect } from "effect";

type ExtractEffectValue<E> = E extends Effect.Effect<infer Value, never, any>
	? Value
	: never;

export type { ExtractEffectValue };
