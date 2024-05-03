import type { Effect } from "effect";

import type { Transaction } from "@soulmate/db";
import type { RowsWTableName } from "@soulmate/validators";

export type GetRowsWTableName = ({
	transaction,
	fullRows,
	authID,
}: {
	transaction: Transaction;
	fullRows: boolean;
	authID: string | null | undefined;
}) => Effect.Effect<RowsWTableName[], never, never>;
