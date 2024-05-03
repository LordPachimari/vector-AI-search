import { Clock, Effect } from "effect";
import type { PullResponseOKV1 } from "replicache";

import type { Db } from "@soulmate/db";
import type { Cookie, PullRequest, SpaceID } from "@soulmate/validators";
import { ulid } from "ulidx";
import { ReplicacheRecordManager } from "./replicache/record-manager";
import { UnknownExceptionLogger } from "@soulmate/utils";

export const pull = <T extends SpaceID>({
	spaceID,
	body: pull,
	authID,
	db,
}: {
	spaceID: T;
	body: PullRequest;
	authID: string | undefined | null;
	db: Db;
}) =>
	Effect.gen(function* (_) {
		const requestCookie = pull.cookie;
		yield* _(Effect.log(`SPACE ID ${spaceID}`));
		yield* _(
			Effect.log("----------------------------------------------------"),
		);

		yield* _(Effect.log(`PROCESSING PULL: ${JSON.stringify(pull, null, "")}`));

		const startTransact = yield* _(Clock.currentTimeMillis);

		// 1: GET PREVIOUS SPACE RECORD AND CLIENT RECORD KEYS
		const oldSpaceRecordKey = requestCookie?.spaceRecordKey;
		const oldClientRecordKey = requestCookie?.clientRecordKey;

		// 2: BEGIN PULL TRANSACTION
		const processPull = yield* _(
			Effect.tryPromise(() =>
				db.transaction(
					async (transaction) =>
						Effect.gen(function* (_) {
							// 3: INIT REPLICACHE
							const REPLICACHE = new ReplicacheRecordManager({
								clientGroupID: pull.clientGroupID,
								spaceID,
								transaction,
								authID,
							});

							const newSpaceRecordKey = ulid();
							const newClientRecordKey = ulid();

							// 4: GET PREVIOUS AND CURRENT RECORDS. (1 ROUND TRIP TO THE DATABASE)
							const [
								oldSpaceRecord,
								oldClientRecord,
								newSpaceRecord,
								newClientRecord,
								clientGroupObject,
							] = yield* _(
								Effect.all(
									[
										REPLICACHE.getOldSpaceRecord(oldSpaceRecordKey),
										REPLICACHE.getOldClientRecord(oldClientRecordKey),
										REPLICACHE.getNewSpaceRecord(newSpaceRecordKey),
										REPLICACHE.getNewClientRecord(),
										REPLICACHE.getClientGroupObject(),
									],
									{
										concurrency: 5,
									},
								),
							);

							const currentTime = yield* _(Clock.currentTimeMillis);

							yield* _(
								Effect.log(
									`TOTAL TIME OF GETTING RECORDS ${
										currentTime - startTransact
									}`,
								),
							);

							// 5: GET RECORDS DIFF
							const [spaceDiff, clientDiff] = yield* _(
								Effect.all([
									REPLICACHE.diffSpaceRecords(oldSpaceRecord, newSpaceRecord),
									REPLICACHE.diffClientRecords(
										oldClientRecord,
										newClientRecord,
									),
								]),
							);
							// 5: GET THE PATCH: THE DIFF TO THE SPACE RECORD. (2D ROUND TRIP TO THE DATABASE)
							// IF PREVIOUS SPACE RECORD IS NOT FOUND, THEN RESET THE SPACE RECORD

							const spacePatch = oldSpaceRecord
								? yield* _(REPLICACHE.createSpacePatch(spaceDiff))
								: yield* _(REPLICACHE.createSpaceResetPatch());

							// 6: PREPARE UPDATES
							const oldSpaceRecordVersion = Math.max(
								clientGroupObject.spaceRecordVersion,
								requestCookie?.order ?? 0,
							);
							const nextSpaceRecordVersion = oldSpaceRecordVersion + 1;
							clientGroupObject.spaceRecordVersion = nextSpaceRecordVersion;

							const nothingToUpdate =
								spacePatch.length === 0 && Object.keys(clientDiff).length === 0;

							// 7: CREATE THE PULL RESPONSE
							const resp: PullResponseOKV1 = {
								lastMutationIDChanges: clientDiff,
								cookie: {
									...requestCookie,
									spaceRecordKey: nothingToUpdate
										? oldSpaceRecordKey
										: newSpaceRecordKey,
									clientRecordKey: nothingToUpdate
										? oldClientRecordKey
										: newClientRecordKey,
									order: nothingToUpdate
										? oldSpaceRecordVersion
										: nextSpaceRecordVersion,
								} satisfies Cookie,
								patch: spacePatch,
							};
							yield* _(Effect.log(`pull response ${JSON.stringify(resp)}`));

							// 8: UPDATE RECORDS IF THERE ARE CHANGES. (3D ROUND TRIP TO THE DATABASE)
							if (!nothingToUpdate) {
								yield* _(Effect.log("UPDATING RECORDS"));
								yield* _(
									Effect.all(
										[
											REPLICACHE.setSpaceRecord(newSpaceRecord.spaceRecord),
											REPLICACHE.setClientGroupObject(clientGroupObject),
											REPLICACHE.deleteSpaceRecord(
												oldSpaceRecord ? oldSpaceRecord.id : undefined,
											),
											REPLICACHE.setClientRecord(
												newClientRecord,
												newClientRecordKey,
											),
											REPLICACHE.deleteClientRecord(oldClientRecordKey),
										],
										{
											concurrency: 4,
										},
									),
								);
							}

							return resp;
						}),
					{ isolationLevel: "repeatable read", accessMode: "read write" },
				),
			).pipe(
				Effect.orDieWith((e) =>
					UnknownExceptionLogger(e, "TRANSACTION ERROR IN PULL"),
				),
			),
		);

		const response = yield* _(processPull);

		const endTransact = yield* _(Clock.currentTimeMillis);

		yield* _(Effect.log(`TOTAL TIME ${endTransact - startTransact}`));

		yield* _(
			Effect.log("----------------------------------------------------"),
		);

		return response;
	});
