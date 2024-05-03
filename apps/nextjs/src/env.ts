/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
	extends: [vercel()],
	shared: {
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	/**
	 * Specify your server-side environment variables schema here.
	 * This way you can ensure the app isn't built with invalid env vars.
	 */
	server: {
		UPLOADTHING_SECRET: z.string(),
		UPLOADTHING_APP_ID: z.string(),
	},

	/**
	 * Specify your client-side environment variables schema here.
	 * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
		NEXT_PUBLIC_REPLICACHE_KEY: z.string(),
		NEXT_PUBLIC_SERVER_URL: z.string(),
		NEXT_PUBLIC_PARTYKIT_HOST: z.string(),
	},
	/**
	 * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
	 */
	experimental__runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		//@ts-ignore
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
		NEXT_PUBLIC_REPLICACHE_KEY: process.env.NEXT_PUBLIC_REPLICACHE_KEY,
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
		NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST,

		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
	},
	skipValidation:
		!!process.env.CI ||
		!!process.env.SKIP_ENV_VALIDATION ||
		process.env.npm_lifecycle_event === "lint",
});
