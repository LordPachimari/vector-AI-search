import { ulid } from "ulidx";

const prefixes = ["user", "chat", "message"] as const;

export type Prefix = (typeof prefixes)[number];

export const generateReplicachePK = ({
	id,
	prefix,
	filterID,
}: {
	prefix: (typeof prefixes)[number];

	id?: string;
	filterID?: string;
}) => {
	return filterID && id
		? `${prefix}_${filterID}_${id}`
		: id
			? `${prefix}_${id}`
			: `${prefix}_${ulid()}`;
};
export const generateID = ({
	prefix,
}: { prefix: (typeof prefixes)[number] }) => {
	return `${prefix}_${ulid()}`;
};
