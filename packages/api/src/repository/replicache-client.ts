import { Effect } from "effect";

import { UnknownExceptionLogger } from "@soulmate/utils";
import type { ReplicacheClient } from "@soulmate/validators";
import { Database } from "../replicache/context";
import { schema } from "@soulmate/db";

function getClientByID({
	clientID,
}: {
	clientID: string;
}) {
	return Effect.gen(function* (_) {
		const { manager } = yield* _(Database);

		const client = yield* _(
			Effect.tryPromise(() =>
				manager.query.replicacheClients.findFirst({
					where: (client, { eq }) => eq(client.id, clientID),
				}),
			).pipe(
				Effect.orDieWith((e) => UnknownExceptionLogger(e, "GET CLIENT ERROR")),
			),
		);

		if (!client)
			return {
				id: clientID,
				clientGroupID: "",
				lastMutationID: 0,
			};

		return client;
	});
}

function setClient(client: ReplicacheClient) {
	return Effect.gen(function* (_) {
		const { manager } = yield* _(Database);

		return yield* _(
			Effect.tryPromise(() =>
				manager
					.insert(schema.replicacheClients)
					//@ts-ignore
					.values(client)
					.onConflictDoUpdate({
						target: schema.replicacheClients.id,
						set: {
							lastMutationID: client.lastMutationID,
						},
					}),
			).pipe(
				Effect.orDieWith((e) => UnknownExceptionLogger(e, "SET CLIENT ERROR")),
			),
		);
	});
}

export { getClientByID, setClient };
