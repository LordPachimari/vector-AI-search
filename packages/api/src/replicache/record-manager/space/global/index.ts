import { Effect, pipe } from "effect";

import { UnknownExceptionLogger } from "@soulmate/utils";

import type { GetRowsWTableName } from "../types";

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
						? transaction.query.users.findMany()
						: transaction.query.users.findMany({
								columns: {
									id: true,
									version: true,
									replicachePK: true,
								},
							}),
				),
				Effect.map((users) => [{ tableName: "users" as const, rows: users }]),
				Effect.orDieWith((e) =>
					UnknownExceptionLogger(e, "ERROR RETRIEVING USER CVD"),
				),
			),
		);

		return cvd;
	});
};
