import { useEffect, useState } from "react";
import type { Replicache } from "replicache";
import { useSubscribe } from "replicache-react";

export const ReplicacheStore = {
	getByPK: <Item>(rep: Replicache | null, key: string) =>
		createGetByPK<Item>(rep, key),
	getByHandle: <Item>(rep: Replicache | null, handle: string) =>
		createGetByHandle<Item>(rep, handle),
	getByID: <Item>(rep: Replicache | null, id: string) =>
		createGetByID<Item>(rep, id),
	getByIDs: <Item>(rep: Replicache | null, ids: string[]) =>
		createGetByIDs<Item>(rep, ids),
	scan: <Item>(rep: Replicache | null, prefix: string) =>
		createScan<Item>(rep, prefix),
};

function createGetByPK<T>(
	rep: Replicache | null,
	key: string,
): T | null | undefined {
	const [itemState, setItemState] = useState<T | null | undefined>(undefined);
	useSubscribe(
		rep,
		async (tx) => {
			const item = await tx.get(key);
			if (item) return setItemState(item as T);
			return setItemState(null);
		},
		{ default: null, dependencies: [key] },
	);

	return itemState;
}

function createGetByID<T>(
	rep: Replicache | null,
	id: string,
): T | null | undefined {
	const [itemState, setItemState] = useState<T | null | undefined>(undefined);

	useSubscribe(
		rep,
		async (tx) => {
			const [item] = await tx
				.scan({
					indexName: "id",
					start: {
						key: [id],
					},

					limit: 1,
				})
				.values()
				.toArray();

			if (item) return setItemState(item as T);
			return setItemState(null);
		},
		{ default: null, dependencies: [id] },
	);

	return itemState;
}
function createGetByIDs<T>(rep: Replicache | null, ids: string[]): T[] {
	const [itemsState, setItemsState] = useState<T[]>([]);

	useSubscribe(
		rep,
		async (tx) => {
			const items: T[] = [];
			for (const id of ids) {
				if (id) {
					const [item] = await tx
						.scan({
							indexName: "id",
							start: {
								key: [id],
							},

							limit: 1,
						})
						.values()
						.toArray();
					items.push(item as T);
				}
			}
			setItemsState(items);
		},
		{ default: [], dependencies: [ids] },
	);

	return itemsState;
}
function createGetByHandle<T>(
	rep: Replicache | null,
	handle: string,
): T | null | undefined {
	const [itemState, setItemState] = useState<T | null | undefined>(undefined);
	useSubscribe(
		rep,
		async (tx) => {
			const [item] = await tx
				.scan({
					indexName: "handle",
					start: {
						key: [handle],
					},
					limit: 1,
				})
				.values()
				.toArray();

			if (item) return setItemState(item as T);
			return setItemState(null);
		},
		{ default: null, dependencies: [handle] },
	);

	return itemState;
}

function createScan<T>(rep: Replicache | null, prefix: string): T[] {
	const [data, setData] = useState<T[]>([]);

	useEffect(() => {
		rep?.experimentalWatch(
			(diffs) => {
				for (const diff of diffs) {
					if (diff.op === "add") {
						setData((prev) => [
							...(prev || []),
							structuredClone(diff.newValue) as T,
						]);
					}

					if (diff.op === "change") {
						setData((prev) => [
							...(prev
								? prev.filter(
										(item) =>
											(item as { replicachePK: string }).replicachePK !==
											diff.key,
									)
								: []),
							structuredClone(diff.newValue) as T,
						]);
					}

					if (diff.op === "del") {
						setData((prev) =>
							prev
								? prev.filter(
										(item) =>
											(item as { replicachePK: string }).replicachePK !==
											diff.key,
									)
								: [],
						);
					}
				}
			},
			{ prefix, initialValuesInFirstDiff: true },
		);
	}, [rep, prefix]);
	return data;
}
