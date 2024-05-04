import { Context, type Effect } from "effect";
import type { ReadonlyJSONObject } from "replicache";

import type { TableName } from "@soulmate/db";
import type { NotFound } from "@soulmate/validators";

type SetItem = ReadonlyJSONObject & {
	id: string;
	replicachePK?: string | null | undefined;
};
class TableMutator extends Context.Tag("TableMutator")<
	TableMutator,
	{
		set(
			value: SetItem | Array<SetItem>,
			tableName: TableName,
		): Effect.Effect<void, NotFound, never>;
		update(
			key: string,
			value: ReadonlyJSONObject,
			tableName: TableName,
		): Effect.Effect<void, NotFound, never>;
		delete(
			key: string | string[],
			tableName: TableName,
		): Effect.Effect<void, NotFound, never>;
	}
>() {}

export { TableMutator };
