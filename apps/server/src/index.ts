import { cors } from "@elysiajs/cors";
import { pull, push } from "@soulmate/api";
import { db, schema } from "@soulmate/db";
import { Index } from "@upstash/vector";
import { Effect } from "effect";
import { Elysia, error } from "elysia";
import { auth, Client } from "twitter-api-sdk";

import {
	SpaceIDSchema,
	pullRequestSchema,
	pushRequestSchema,
} from "@soulmate/validators";
import { z } from "zod";
import { UnknownExceptionLogger } from "@soulmate/utils";
const STATE = "uni-soulmate";
const authClient = new auth.OAuth2User({
	client_id: process.env.TWITTER_CLIENT_ID ?? "",
	client_secret: process.env.TWITTER_CLIENT_SECRET,
	callback: process.env.TWITTER_REDIRECT_URL ?? "",
	scopes: ["tweet.read", "users.read", "bookmark.read", "like.read"],
});
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
	.post("/twitter-auth-url", async ({ store }) => {
		try {
			const url = authClient.generateAuthURL({
				state: STATE,
				code_challenge_method: "s256",
			});

			return url;
		} catch (err) {
			console.error(err);
			return error(500, "Internal Server Error");
		}
	})
	.post("/store-twitter-data", async ({ store, headers }) => {
		const code = headers["x-twitter-code"];
		if (!code) return error(400, "Bad Request");
		const client = new Client(authClient);
		const userID = headers["x-user-id"];
		try {
			await authClient.requestAccessToken(code as string);

			const index = new Index({
				url: process.env.UPSTASH_URL,
				token: process.env.UPSTASH_TOKEN,
			});
			const user = (
				await client.users.findMyUser({
					"user.fields": ["id", "username", "description"],
				})
			).data;

			//THESE ENDPOINTS ARE NOT FREE -> bookmarks, likes, follows
			//THATS WHY WE ONLY STORE USER USERNAME AND DESCRIPTION. CAPPED EVERYONE

			user &&
				(await index.upsert({
					id: user.id,
					data: `${user.username} ${user.description}`,
					metadata: {
						description: user.description,
						userID,
					},
				}));
		} catch (err) {
			console.error("ERROR CATCHED", JSON.stringify(err));
			return error(500, "Internal Server Error");
		}
	})
	.listen(8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
