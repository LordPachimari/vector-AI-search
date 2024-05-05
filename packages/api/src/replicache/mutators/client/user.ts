import type { WriteTransaction } from "replicache";

import type { CreateUser, UpdateUser, User } from "@soulmate/validators";
import { getEntityFromID } from "./util/get-id";

async function createUser(tx: WriteTransaction, input: CreateUser) {
	const { user } = input;
	await tx.set(user.replicachePK, user);
}

async function updateUser(tx: WriteTransaction, input: UpdateUser) {
	const { id, updates } = input;

	const user = (await getEntityFromID(tx, id)) as User | undefined;

	if (!user) {
		console.info("User  not found");
		throw new Error("User not found");
	}
	await tx.set(user.replicachePK, { ...user, ...updates });
}

export { updateUser, createUser };
