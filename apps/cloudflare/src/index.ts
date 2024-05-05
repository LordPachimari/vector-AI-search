import { Pool } from "@neondatabase/serverless";
import { pull, push } from "@soulmate/api";
import { schema } from "@soulmate/db";
import { UnknownExceptionLogger } from "@soulmate/utils";
import {
	SpaceIDSchema,
	pullRequestSchema,
	pushRequestSchema,
} from "@soulmate/validators";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Effect } from "effect";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

export type Bindings = {
	DATABASE_URL: string;
	KV: KVNamespace;
	PARTYKIT_ORIGIN: string;
	SERVER_URL: string;
	GOOGLE_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	"*",
	cors({
		origin: ["http://localhost:3000", "https://uni-soulmate.vercel.app"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		maxAge: 600,
		credentials: true,
	}),
);
app.get("/", (c) => {
	return c.text("Hello Hono!");
});
app.post("/create-user", async (c) => {
	const client = new Pool({ connectionString: c.env.DATABASE_URL });
	const db = drizzle(client, { schema: schema });
	try {
		const parsedBody = z.object({ id: z.string() }).parse(await c.req.json());
		await db.insert(schema.users).values({
			id: parsedBody.id,
			replicachePK: parsedBody.id,
			createdAt: new Date().toISOString(),
			version: 0,
		});
		return c.json({}, 200);
	} catch (error) {
		console.log("error", error);

		return c.json({}, 500);
	}
});
app.post("/create-soulmate-chat", async (c) => {
	const client = new Pool({ connectionString: c.env.DATABASE_URL });
	const db = drizzle(client, { schema: schema });
	try {
		const { userID } = z
			.object({ userID: z.string() })
			.parse(await c.req.json());
		await db
			.insert(schema.chats)
			.values({
				id: `soulmate_chat_${userID}`,
				replicachePK: `soulmate_chat_${userID}`,
				createdAt: new Date().toISOString(),
				version: 0,
				chatter1ID: userID,
			})
			.onConflictDoNothing();
		return c.json({}, 200);
	} catch (error) {
		console.log("error", error);
		return c.json({}, 500);
	}
});
app.post("/pull/:spaceID", async (c) => {
	const client = new Pool({ connectionString: c.env.DATABASE_URL });
	const db = drizzle(client, { schema: schema });
	const spaceID = SpaceIDSchema.parse(c.req.param("spaceID"));
	const body = pullRequestSchema.parse(await c.req.json());
	const userID = c.req.header("x-user-id");

	// 2: PULL
	const pullEffect = pull({
		body,
		db,
		spaceID,
		authID: userID,
	}).pipe(Effect.orDieWith((e) => UnknownExceptionLogger(e, "pull error")));

	// 3: RUN PROMISE
	const pullResponse = await Effect.runPromise(pullEffect);

	return c.json(pullResponse, 200);
});
app.post("/push/:spaceID", async (c) => {
	// 1: PARSE INPUT
	const client = new Pool({ connectionString: c.env.DATABASE_URL });
	const db = drizzle(client, { schema: schema });
	const spaceID = SpaceIDSchema.parse(c.req.param("spaceID"));
	const body = pushRequestSchema.parse(await c.req.json());

	const userID = c.req.header("x-user-id");

	// 2: PULL
	const pushEffect = push({
		body,
		db,
		spaceID,
		authID: userID,
		partyKitOrigin: c.env.PARTYKIT_ORIGIN,
		serverURL: c.env.SERVER_URL,
		GOOGLE_API_KEY: c.env.GOOGLE_API_KEY,
	}).pipe(Effect.orDieWith((e) => UnknownExceptionLogger(e, "pull error")));

	// 3: RUN PROMISE
	await Effect.runPromise(pushEffect);

	return c.json({}, 200);
});

export default app;
