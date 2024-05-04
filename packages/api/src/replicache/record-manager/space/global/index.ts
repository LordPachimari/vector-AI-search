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
						? transaction.query.users.findFirst({
								where: (users, {eq}) => eq(users.id, authID),
							})
						: transaction.query.users.findFirst({
								columns: {
									id: true,
									version: true,
									replicachePK: true,
								},
								where: (users, {eq}) => eq(users.id, authID),
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
