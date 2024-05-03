import { eq, inArray, sql } from "drizzle-orm";
import { Effect, Layer } from "effect";
import { isArray, isString } from "remeda";

import { tableNameToTableMap } from "@soulmate/db";
import { NotFound } from "@soulmate/validators";
import { Database } from "../context/database";
import { TableMutator } from "../context/table-mutator";
import { idToReplicachePK } from "../record-manager/data";

const TableMutatorLive = Layer.effect(
	TableMutator,
	Effect.gen(function* (_) {
		const { manager } = yield* _(Database);

		return {
			set(value, tableName) {
				if (isArray(value) && value.length === 0) return Effect.succeed({});
				return Effect.gen(function* (_) {
					const table = tableNameToTableMap[tableName];

					if (!table)
						return yield* _(
							Effect.fail(
								new NotFound({
									message: "Table name not found",
								}),
							),
						);

					//necessary to retrieve PK's for object removal on the client, using the patch
					const idToPK = idToReplicachePK({ value, manager: manager }).pipe(
						Effect.orDie,
					);

					const insert = Effect.tryPromise(() => {
						return (
							manager
								.insert(table)
								//@ts-ignore
								.values(isArray(value) ? value : [value])
								.onConflictDoNothing()
						);
					}).pipe(Effect.orDie);

					return yield* _(Effect.all([insert, idToPK], { concurrency: 2 }));
				});
			},
			update(key, value, tableName) {
				return Effect.gen(function* (_) {
					const table = tableNameToTableMap[tableName];

					if (!table)
						return yield* _(
							Effect.fail(
								new NotFound({
									message: "Table name not found",
								}),
							),
						);

					return yield* _(
						Effect.tryPromise(() =>
							manager
								.update(table)
								.set({
									...value,
									version: sql`${table.version} + 1`,
								})
								.where(eq(table.id, key)),
						).pipe(Effect.orDie),
					);
				});
			},
			delete(key, tableName) {
				return Effect.gen(function* (_) {
					const table = tableNameToTableMap[tableName];

					if (!table)
						return yield* _(
							Effect.fail(
								new NotFound({
									message: "Table name not found",
								}),
							),
						);

					return yield* _(
						Effect.tryPromise(() =>
							isString(key)
								? manager.delete(table).where(eq(table.id, key))
								: manager.delete(table).where(inArray(table.id, key)),
						).pipe(Effect.orDie),
					);
				});
			},
		};
	}),
);

export { TableMutatorLive };
