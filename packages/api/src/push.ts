import { Clock, Effect, Layer } from "effect";

import { tableNameToTableMap, type Db } from "@soulmate/db";
import {
	InternalServerError,
	type AuthorizationError,
	type Mutation,
	type NotFound,
	type PushRequest,
	type SpaceID,
} from "@soulmate/validators";

import { UnknownExceptionLogger } from "@soulmate/utils";
import type { UnknownException } from "effect/Cause";
import type { ZodError } from "zod";
import { Server } from "./replicache";
import { Database, type TableMutator } from "./replicache/context";
import { ReplicacheClientRepository } from "./repository";
import { TableMutatorLive } from "./replicache/context-live";

export const push = ({
	body: push,
	authID,
	db,
	spaceID,
	partyKitOrigin,
}: {
	body: PushRequest;
	authID: string | null | undefined;
	db: Db;
	spaceID: SpaceID;
	partyKitOrigin: string;
}) =>
	Effect.gen(function* (_) {
		if (!authID) return;
		yield* _(
			Effect.log("----------------------------------------------------"),
		);
		yield* _(Effect.log(`PROCESSING PUSH: ${JSON.stringify(push, null, "")}`));

		const startTime = yield* _(Clock.currentTimeMillis);
		const mutators =
			spaceID === "global" ? Server.GlobalMutatorsMap : Server.ChatMutatorsMap;

		yield* _(
			Effect.forEach(push.mutations, (mutation) =>
				Effect.gen(function* (_) {
					// 1: START TRANSACTION FOR EACH MUTATION
					const mutationEffect = yield* _(
						Effect.tryPromise(() =>
							db.transaction(
								async (transaction) =>
									Effect.gen(function* (_) {
										yield* _(
											Effect.log("------> Processing TRANSACTION <-----"),
										);
										const DatabaseLive = Layer.succeed(
											Database,
											Database.of({
												manager: transaction,
												tableNameToTableMap,
											}),
										);
										// 2: GET CLIENT ROW
										const baseClient = yield* _(
											Effect.provide(
												ReplicacheClientRepository.getClientByID({
													clientID: mutation.clientID,
												}),
												DatabaseLive,
											),
										);

										let updated = false;

										const mutationContext = TableMutatorLive.pipe(
											Layer.provideMerge(DatabaseLive),
										);

										// 3: PROCESS MUTATION
										const nextMutationID = yield* _(
											Effect.provide(
												processMutation({
													lastMutationID: baseClient.lastMutationID,
													mutation,
													mutators,
												}),
												mutationContext,
											).pipe(Effect.orDie),
										);

										if (baseClient.lastMutationID < nextMutationID) {
											updated = true;
										}

										if (updated) {
											yield* _(Effect.log("updating client"));
											yield* _(
												Effect.provide(
													ReplicacheClientRepository.setClient({
														clientGroupID: push.clientGroupID,
														id: mutation.clientID,
														lastMutationID: nextMutationID,
													}),
													DatabaseLive,
												),
											);
										} else {
											yield* _(Effect.log("Nothing to update"));
										}
									}),
								{ isolationLevel: "repeatable read", accessMode: "read write" },
							),
						).pipe(
							Effect.orDieWith((e) =>
								UnknownExceptionLogger(e, "transaction error"),
							),
						),
					);

					yield* _(Effect.retry(mutationEffect, { times: 2 }));

					yield* Effect.log(`ORIGIN PARTYKIT ${partyKitOrigin}`);
					yield* Effect.log(`${partyKitOrigin}/parties/main/${spaceID}`);

					yield* _(
						Effect.tryPromise(() =>
							fetch(`${partyKitOrigin}/parties/main/${spaceID}`, {
								method: "POST",
								body: spaceID,
								// body: JSON.stringify(""),
							}),
						)
							.pipe(Effect.retry({ times: 2 }))
							.pipe(
								Effect.catchAll((e) =>
									Effect.gen(function* () {
										yield* Effect.log(e);
										yield* Effect.log("partykit error");
										return yield* Effect.succeed({});
									}),
								),
							),
					);
				}),
			),
		);

		//TODO: send poke
		const endTime = yield* _(Clock.currentTimeMillis);
		yield* _(Effect.log(`Processed all mutations in ${endTime - startTime}`));
	});

const processMutation = ({
	mutation,
	error,
	lastMutationID,
	mutators,
}: {
	mutation: Mutation;
	lastMutationID: number;
	error?: unknown;
	mutators: Server.GlobalMutatorsMapType | Server.ChatMutatorsMapType;
}): Effect.Effect<
	number,
	ZodError<any> | UnknownException | NotFound | InternalServerError,
	Database | TableMutator
> =>
	Effect.gen(function* (_) {
		const expectedMutationID = lastMutationID + 1;

		if (mutation.id < expectedMutationID) {
			yield* _(
				Effect.log(
					`Mutation ${mutation.id} has already been processed - skipping`,
				),
			);

			return lastMutationID;
		}

		if (mutation.id > expectedMutationID) {
			yield* _(
				Effect.logWarning(
					`Mutation ${mutation.id} is from the future - aborting`,
				),
			);

			yield* _(
				Effect.fail(
					new InternalServerError({
						message: `Mutation ${mutation.id} is from the future - aborting`,
					}),
				),
			);
		}

		if (!error) {
			yield* _(
				Effect.log(
					`Processing mutation: ${JSON.stringify(mutation, null, "")}`,
				),
			);
			const start = yield* _(Clock.currentTimeMillis);

			const { name, args } = mutation;

			const mutator = mutators.get(name);

			if (!mutator) {
				yield* _(
					Effect.fail(
						new InternalServerError({
							message: `No mutator found for ${name}`,
						}),
					),
				);

				return lastMutationID;
			}

			//@ts-ignore
			yield* _(mutator(args));

			const end = yield* _(Clock.currentTimeMillis);

			yield* _(Effect.log(`Processed mutation in ${end - start}`));

			return expectedMutationID;
		}
		// TODO: You can store state here in the database to return to clients to
		// provide additional info about errors.
		yield* _(
			Effect.log(`Handling error from mutation ${JSON.stringify(mutation)} `),
		);

		return lastMutationID;
	});
