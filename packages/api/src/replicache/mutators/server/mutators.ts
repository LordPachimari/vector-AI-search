import type { SpaceID } from "@soulmate/validators";
import { updateUser } from "./user";

const GlobalMutators = {
	updateUser,
};

export const GlobalMutatorsMap = new Map(Object.entries(GlobalMutators));
export type GlobalMutatorsType = typeof GlobalMutators;
export type GlobalMutatorsMapType = typeof GlobalMutatorsMap;

type MutatorKeys = keyof GlobalMutatorsType;
//affected spaces and its subspaces
export type AffectedSpaces = Record<MutatorKeys, Partial<SpaceID>>;

export const affectedSpaces: AffectedSpaces = {
	updateUser: "global",
};
