import type { WriteTransaction } from "replicache";

export async function getEntityFromID(tx: WriteTransaction, id: string) {
	const [item] = await tx
		.scan({
			indexName: "id",
			start: {
				key: [id],
			},
			limit: 1,
		})
		.entries()
		.toArray();

	if (!item) return undefined;

	const [_, value] = item;

	return value;
}
