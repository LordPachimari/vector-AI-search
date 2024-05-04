import { cors } from "@elysiajs/cors";
import { pull, push } from "@soulmate/api";
import { db, schema } from "@soulmate/db";
import { Effect } from "effect";
import { Elysia } from "elysia";
import PartySocket from "partysocket";

import {
	SpaceIDSchema,
	pullRequestSchema,
	pushRequestSchema,
} from "@soulmate/validators";
import { z } from "zod";
import { UnknownExceptionLogger } from "@soulmate/utils";
const app = new Elysia()
	.use(
		cors({
			origin: /localhost.*/,
			methods: ["POST", "OPTIONS", "GET", "PUT"],
			credentials: true,
		}),
	)
	.post("/create-user", async ({ body }) => {
		try {
			const parsedBody = z.object({ id: z.string() }).parse(body);
			await db.insert(schema.users).values({
				id: parsedBody.id,
				replicachePK: parsedBody.id,
				createdAt: new Date().toISOString(),
				version: 0,
			});
		} catch (error) {
			console.log("error", error);
		}
	})
	.post("/pull/:spaceID", async ({ params, body, headers }) => {
		// 1: PARSE INPUT
		const spaceID = SpaceIDSchema.parse(params.spaceID);
		const pullBody = pullRequestSchema.parse(body);
		const userID = headers["x-user-id"];
		console.log("userID", userID);

		// 2: PULL
		const pullEffect = pull({
			body: pullBody,
			db,
			spaceID,
			authID: userID,
		}).pipe(Effect.orDie);

		// 3: RUN PROMISE
		return await Effect.runPromise(pullEffect);
	})
	.post("/push/:spaceID", async ({ params, headers, body, query }) => {
		// 1: PARSE INPUT
		const spaceID = SpaceIDSchema.parse(params.spaceID);
		const pushBody = pushRequestSchema.parse(body);
		const userID = headers["x-user-id"];

		console.log("userID", userID);

		// 2: PULL
		const pushEffect = push({
			body: pushBody,
			db,
			spaceID,
			authID: userID,
			partyKitOrigin: process.env.PARTYKIT_ORIGIN!,
		}).pipe(Effect.orDieWith((e) => UnknownExceptionLogger(e, "push error")));

		// 3: RUN PROMISE

		await Effect.runPromise(pushEffect);
	})
	.listen(8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
