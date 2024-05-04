import { Effect } from "effect";

import { UnknownExceptionLogger } from "@soulmate/utils";

import type { RowsWTableName } from "@soulmate/validators";
import type { GetRowsWTableName } from "../types";

export const chatCVD: GetRowsWTableName = ({
	transaction,
	fullRows = false,
	authID,
}) => {
	return Effect.gen(function* (_) {
		if (!authID) return [];
		const rowsWTableName: RowsWTableName[] = [];
		const chatCVD = yield* _(
			Effect.tryPromise(() =>
				fullRows
					? transaction.query.chats.findMany({
							where:(chats, {or, eq})=> or(
								eq(chats.chatter1ID, authID),
								eq(chats.chatter2ID, authID),
							),
							with: {
								messages: true,
							},
						})
					: transaction.query.chats.findMany({
							where:(chats, {or, eq})=> or(
								eq(chats.chatter1ID, authID),
								eq(chats.chatter2ID, authID),
							),
							columns: {
								id: true,
								version: true,
								replicachePK: true,
							},
							with: {
								messages: {
									columns: {
										id: true,
										version: true,
										replicachePK: true,
									},
								},
							},
						}),
			).pipe(
				Effect.orDieWith((e) =>
					UnknownExceptionLogger(e, "ERROR RETRIEVING PRODUCTS ROWS"),
				),
			),
		);

		yield* _(
			Effect.all(
				[
					//push variants before products, as products.variants = [] modifies variants property
					Effect.sync(() =>
						rowsWTableName.push({
							tableName: "messages" as const,
							rows: chatCVD.flatMap((value) => value.messages),
						}),
					),
					Effect.sync(() =>
						rowsWTableName.push({
							tableName: "chats" as const,
							rows: chatCVD.map((chat) => {
								chat.messages = [];
								return chat;
							}),
						}),
					),
				],
				{ concurrency: 2 },
			),
		);
		yield* _(Effect.log(`CHAT CVD ${JSON.stringify(rowsWTableName)}`));

		return rowsWTableName;
	});
};
