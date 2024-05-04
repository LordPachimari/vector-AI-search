import { Hono } from "hono";
import { cors } from "hono/cors";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { schema, type Db } from "@soulmate/db";
import { z } from "zod";
import {
	SpaceIDSchema,
	pullRequestSchema,
	pushRequestSchema,
} from "@soulmate/validators";
import { Effect } from "effect";
import { pull, push } from "@soulmate/api";

export type Bindings = {
	DATABASE_URL: string;
	KV: KVNamespace;
	PARTYKIT_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3000",
			"https://pachi-dev.vercel.app",
			"https://pachi.vercel.app",
		],
		allowMethods: ["POST", "GET", "OPTIONS"],
		maxAge: 600,
		credentials: true,
	}),
);
app.use("*", async (c, next) => {
	const client = new Pool({ connectionString: c.env.DATABASE_URL });
	const db = drizzle(client, { schema: schema });

	c.set("db" as never, db);

	return next();
});
app.get("/", (c) => {
	return c.text("Hello Hono!");
});
app.post("/create-user", async (c) => {
	const db = c.get("db" as never) as Db;
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
app.post("/pull/:spaceID", async (c) => {
	// 1: PARSE INPUT
	const db = c.get("db" as never) as Db;
	const spaceID = SpaceIDSchema.parse(c.req.param("spaceID"));
	const body = pullRequestSchema.parse(await c.req.json());
	const userID = c.req.header("x-user-id");
	console.log("userID", userID);

	// 2: PULL
	const pullEffect = pull({
		body,
		db,
		spaceID,
		authID: userID,
	}).pipe(Effect.orDie);

	// 3: RUN PROMISE
	const pullResponse = await Effect.runPromise(pullEffect);

	return c.json(pullResponse, 200);
});
app.post("/push/:spaceID", async (c) => {
	// 1: PARSE INPUT
	const db = c.get("db" as never) as Db;
	const spaceID = SpaceIDSchema.parse(c.req.param("spaceID"));
	const body = pushRequestSchema.parse(await c.req.json());

	const userID = c.req.header("x-user-id");
	console.log("userID", userID);

	// 2: PULL
	const pushEffect = push({
		body,
		db,
		spaceID,
		authID: userID,
		partyKitOrigin: c.env.PARTYKIT_ORIGIN,
	}).pipe(Effect.orDie);

	// 3: RUN PROMISE
	await Effect.runPromise(pushEffect);

	return c.json({}, 200);
});

export default app;
