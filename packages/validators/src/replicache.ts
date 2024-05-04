import { createInsertSchema } from "drizzle-zod";
import type { PatchOperation } from "replicache";
import { z } from "zod";

import type { TableName } from "@soulmate/db";
import { schema } from "@soulmate/db";

export const clientGroupSchema = createInsertSchema(
	schema.replicacheClientGroups,
);
export type ClientGroupObject = z.infer<typeof clientGroupSchema>;
export const ReplicacheClientSchema = createInsertSchema(
	schema.replicacheClients,
);
export type ReplicacheClient = z.infer<typeof ReplicacheClientSchema>;
export const ReplicacheSpaceRecordSchema = createInsertSchema(
	schema.replicacheSpaceRecords,
).extend({
	record: z.record(z.string(), z.number()),
});
export type ReplicacheSpaceRecord = z.infer<typeof ReplicacheSpaceRecordSchema>;
export type ClientViewRecord = Record<string, number>;
export type Row = Record<string, unknown> & {
	id: string;
	replicachePK: string | null;
	version: number;
};
export type RowsWTableName = { tableName: TableName; rows: Row[] };
export const SpaceIDSchema = z.enum(["chat", "global"] as const);
export type SpaceID = z.infer<typeof SpaceIDSchema>;
export type Mutation = z.infer<typeof mutationSchema>;
export const mutationSchema = z.object({
	id: z.number(),
	name: z.string(),
	args: z.unknown(),
	clientID: z.string(),
});
export const pushRequestSchema = z.object({
	clientGroupID: z.string(),
	mutations: z.array(mutationSchema),
});
export type PushRequest = z.infer<typeof pushRequestSchema>;
export type PullResponse = {
	cookie: string;
	lastMutationIDChanges: Record<string, number>;
	patch: PatchOperation[];
};
export const cookieSchema = z.object({
	spaceRecordKey: z.optional(z.string()),
	clientRecordKey: z.optional(z.string()),
	order: z.number(),
});
export type Cookie = z.infer<typeof cookieSchema>;
export const pullRequestSchema = z.object({
	clientGroupID: z.string(),
	cookie: z.union([cookieSchema, z.null()]),
});
export type PullRequest = z.infer<typeof pullRequestSchema>;
export const RequestHeadersSchema = z.object({
	countryCode: z.string().nullable(),
});
export type RequestHeaders = z.infer<typeof RequestHeadersSchema>;
