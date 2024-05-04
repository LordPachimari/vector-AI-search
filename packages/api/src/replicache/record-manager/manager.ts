import type { Effect } from "effect";
import type { PatchOperation } from "replicache";

import type { TableName, Transaction } from "@soulmate/db";
import type {
	ClientGroupObject,
	ClientViewRecord,
	ReplicacheClient,
	ReplicacheSpaceRecord,
	RowsWTableName,
	SpaceID,
} from "@soulmate/validators";

import {
	createSpacePatch,
	createSpaceResetPatch,
	deleteClientRecord,
	deleteSpaceRecord,
	diffClientRecords,
	diffSpaceRecords,
	getClientGroupObject,
	getNewClientRecord,
	getNewSpaceRecord,
	getOldClientRecord,
	getOldSpaceRecord,
	setClientGroupObject,
	setClientRecord,
	setSpaceRecord,
} from "./data";
import type { ExtractEffectValue } from "@soulmate/utils";

interface SpaceRecordDiff {
	newIDs: Map<TableName, Set<string>>;
	deletedIDs: string[];
}

type SpaceRecord = Omit<ReplicacheSpaceRecord, "version" | "replicachePK">;

type ClientRecordDiff = Record<string, number>;

interface ReplicacheRecordManagerBase {
	getOldClientRecord: (
		key: string,
	) => Effect.Effect<ClientViewRecord | undefined, never, never>;
	getNewClientRecord: () => Effect.Effect<
		Pick<ReplicacheClient, "id" | "lastMutationID">[],
		never,
		never
	>;
	getOldSpaceRecord: (
		key: string,
	) => Effect.Effect<SpaceRecord | undefined, never, never>;
	getNewSpaceRecord: (newSpaceKey: string) => Effect.Effect<
		{
			rows: Array<RowsWTableName>;
			spaceRecord: SpaceRecord;
		},
		never,
		never
	>;
	getClientGroupObject: () => Effect.Effect<ClientGroupObject, never, never>;
	diffSpaceRecords: (
		prevRecord: ExtractEffectValue<ReturnType<this["getOldSpaceRecord"]>>,
		currentRecord: ExtractEffectValue<ReturnType<this["getNewSpaceRecord"]>>,
	) => Effect.Effect<SpaceRecordDiff, never, never>;
	diffClientRecords: (
		prevRecord: ExtractEffectValue<ReturnType<this["getOldClientRecord"]>>,
		currentRecord: ExtractEffectValue<ReturnType<this["getNewClientRecord"]>>,
	) => Effect.Effect<ClientRecordDiff, never, never>;
	createSpacePatch: (
		diff: ExtractEffectValue<ReturnType<this["diffSpaceRecords"]>>,
	) => Effect.Effect<PatchOperation[], never, never>;
	createSpaceResetPatch: (
		diff: ExtractEffectValue<ReturnType<this["diffSpaceRecords"]>>,
	) => Effect.Effect<PatchOperation[], never, never>;
	setClientRecord: (
		newClientRecord: Pick<ReplicacheClient, "id" | "lastMutationID">[],
		newKey: string,
	) => Effect.Effect<void, never, never>;
	deleteClientRecord: (
		key: string | undefined,
	) => Effect.Effect<void, never, never>;
	setSpaceRecord: (
		spaceRecord: SpaceRecord,
	) => Effect.Effect<void, never, never>;
	setClientGroupObject: (
		clientGroupObject: ClientGroupObject,
	) => Effect.Effect<void, never, never>;

	deleteSpaceRecord: (
		keys: string | undefined,
	) => Effect.Effect<void, never, never>;
}

class ReplicacheRecordManager implements ReplicacheRecordManagerBase {
	private readonly spaceID: SpaceID;
	private readonly transaction: Transaction;
	private readonly clientGroupID: string;
	private readonly authID: string | undefined | null;
	constructor({
		spaceID,
		transaction,
		clientGroupID,
		authID,
	}: {
		spaceID: SpaceID;
		transaction: Transaction;
		clientGroupID: string;
		authID: string | undefined | null;
	}) {
		this.spaceID = spaceID;
		this.transaction = transaction;
		this.clientGroupID = clientGroupID;
		this.authID = authID;
	}
	getOldClientRecord(key: string | undefined) {
		return getOldClientRecord({
			key,
			transaction: this.transaction,
		});
	}
	getNewClientRecord() {
		return getNewClientRecord({
			clientGroupID: this.clientGroupID,
			transaction: this.transaction,
		});
	}
	getOldSpaceRecord(key: string | undefined) {
		return getOldSpaceRecord({
			key,
			transaction: this.transaction,
			spaceID: this.spaceID,
		});
	}
	getNewSpaceRecord(newSpaceRecordKey: string) {
		return getNewSpaceRecord({
			spaceID: this.spaceID,
			transaction: this.transaction,
			newSpaceRecordKey,
			authID: this.authID,
		});
	}
	getClientGroupObject() {
		return getClientGroupObject({
			transaction: this.transaction,
			clientGroupID: this.clientGroupID,
		});
	}

	diffClientRecords(
		prevRecord: ExtractEffectValue<ReturnType<this["getOldClientRecord"]>>,

		currentRecord: ExtractEffectValue<ReturnType<this["getNewClientRecord"]>>,
	) {
		return diffClientRecords({ prevRecord, currentRecord });
	}

	diffSpaceRecords(
		prevRecord: ExtractEffectValue<ReturnType<this["getOldSpaceRecord"]>>,
		currentRecord: ExtractEffectValue<ReturnType<this["getNewSpaceRecord"]>>,
	) {
		return diffSpaceRecords({ prevRecord, currentRecord });
	}

	createSpacePatch(
		diff: ExtractEffectValue<ReturnType<this["diffSpaceRecords"]>>,
	) {
		return createSpacePatch({
			diff,
			transaction: this.transaction,
		});
	}

	createSpaceResetPatch() {
		return createSpaceResetPatch({
			transaction: this.transaction,
			spaceID: this.spaceID,
			authID: this.authID,
		});
	}

	setClientRecord(
		newClientRecord: Pick<ReplicacheClient, "id" | "lastMutationID">[],
		newKey: string,
	) {
		return setClientRecord({
			newClientRecord,
			transaction: this.transaction,
			newKey,
		});
	}
	deleteClientRecord(key: string | undefined) {
		return deleteClientRecord({
			key,
			transaction: this.transaction,
		});
	}
	setSpaceRecord(spaceRecord: SpaceRecord) {
		return setSpaceRecord({
			spaceRecord,
			transaction: this.transaction,
		});
	}
	deleteSpaceRecord(key: string | undefined) {
		return deleteSpaceRecord({
			key,
			transaction: this.transaction,
		});
	}
	setClientGroupObject(clientGroupObject: ClientGroupObject) {
		return setClientGroupObject({
			clientGroupObject,
			transaction: this.transaction,
		});
	}
}

export { ReplicacheRecordManager };
export type {
	ClientRecordDiff,
	ReplicacheRecordManagerBase,
	SpaceRecordDiff,
	SpaceRecord,
};
