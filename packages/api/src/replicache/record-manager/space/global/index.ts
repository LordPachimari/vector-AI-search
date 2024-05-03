import { Effect, pipe } from "effect";

import { UnknownExceptionLogger } from "@soulmate/utils";

import type { GetRowsWTableName } from "../types";
import { eq, schema } from "@soulmate/db";

export const globalCVD: GetRowsWTableName = ({
	transaction,
	authID,
	fullRows = false,
}) => {
	return Effect.gen(function* (_) {
		if (!authID) return [];
		const cvd = yield* _(
			pipe(
				Effect.tryPromise(() =>
					fullRows
						? transaction.query.users.findFirst({
								where: () => eq(schema.users.id, authID),
							})
						: transaction.query.users.findFirst({
								columns: {
									id: true,
									version: true,
									replicachePK: true,
								},
								where: () => eq(schema.users.id, authID),
							}),
				),
				Effect.map((user) => [
					{ tableName: "users" as const, rows: user ? [user] : [] },
				]),
				Effect.orDieWith((e) =>
					UnknownExceptionLogger(e, "ERROR RETRIEVING USER CVD"),
				),
			),
		);

		return cvd;
	});
};
